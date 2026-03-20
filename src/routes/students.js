import { Router } from 'express';
import { pool } from '../db/pool.js';
import QRCode from 'qrcode';
const router = Router();

function calcEndDate(subscriptionType, startDate, sessionsCount) {
  const d = new Date(startDate);
  if (subscriptionType === 'monthly') d.setMonth(d.getMonth() + 1);
  else if (subscriptionType === 'daily') d.setDate(d.getDate() + 1);
  else if (subscriptionType === 'hourly') d.setDate(d.getDate() + 30);
  else if (subscriptionType === 'package') d.setDate(d.getDate() + Math.max(30, sessionsCount || 0));
  return d.toISOString().slice(0,10);
}

router.get('/', async (_req, res) => {
  const result = await pool.query(`
    SELECT s.*, g.full_name AS guardian_name, g.phone_primary
    FROM students s
    LEFT JOIN guardians g ON g.id = s.guardian_id
    ORDER BY s.id DESC
  `);
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const student = await pool.query(`
    SELECT s.*, g.full_name AS guardian_name, g.phone_primary, g.phone_secondary, g.relation, g.preferred_channel, g.notes AS guardian_notes
    FROM students s
    LEFT JOIN guardians g ON g.id = s.guardian_id
    WHERE s.id = $1
  `, [req.params.id]);
  if (!student.rowCount) return res.status(404).json({ message: 'Student not found' });
  const payments = await pool.query('SELECT * FROM payments WHERE student_id = $1 ORDER BY id DESC', [req.params.id]);
  const attendance = await pool.query('SELECT * FROM attendance_logs WHERE student_id = $1 ORDER BY logged_at DESC LIMIT 20', [req.params.id]);
  res.json({ student: student.rows[0], payments: payments.rows, attendance: attendance.rows });
});

router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const b = req.body;
    const guardianResult = await client.query(`
      INSERT INTO guardians (full_name, phone_primary, phone_secondary, relation, preferred_channel, notes)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `, [b.guardian_name, b.phone_primary, b.phone_secondary || null, b.relation || null, b.preferred_channel || 'whatsapp', b.guardian_notes || null]);
    const guardian = guardianResult.rows[0];
    const end_date = calcEndDate(b.subscription_type, b.start_date, Number(b.sessions_count || 0));
    const studentResult = await client.query(`
      INSERT INTO students (
        full_name, grade, photo_url, status, notes, guardian_id,
        subscription_type, subscription_price, sessions_count, start_date, end_date
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `, [
      b.student_name, b.grade, b.photo_url || null, b.student_status || 'active', b.student_notes || null,
      guardian.id, b.subscription_type, Number(b.subscription_price || 0), Number(b.sessions_count || 0), b.start_date, end_date
    ]);
    const student = studentResult.rows[0];
    const qrPayload = JSON.stringify({ studentId: student.id, studentName: student.full_name, guardianPhone: guardian.phone_primary });
    const qr = await QRCode.toDataURL(qrPayload);
    await client.query('UPDATE students SET qr_code_data_url = $1 WHERE id = $2', [qr, student.id]);
    if (Number(b.first_payment_amount || 0) > 0) {
      await client.query(`
        INSERT INTO payments (student_id, amount, payment_method, payment_date, notes)
        VALUES ($1,$2,$3,$4,$5)
      `, [student.id, Number(b.first_payment_amount), b.first_payment_method || 'cash', b.first_payment_date || b.start_date, b.first_payment_notes || null]);
    }
    await client.query('COMMIT');
    res.status(201).json({ id: student.id, qr_code_data_url: qr, end_date });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});
export default router;