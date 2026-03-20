import { Router } from 'express';
import { pool } from '../db/pool.js';
const router = Router();
router.post('/scan', async (req, res) => {
  const { student_id } = req.body;
  const student = await pool.query('SELECT id, full_name FROM students WHERE id = $1', [student_id]);
  if (!student.rowCount) return res.status(404).json({ message: 'Student not found' });
  const last = await pool.query('SELECT event_type FROM attendance_logs WHERE student_id = $1 ORDER BY logged_at DESC LIMIT 1', [student_id]);
  const nextEvent = !last.rowCount || last.rows[0].event_type === 'check-out' ? 'check-in' : 'check-out';
  await pool.query('INSERT INTO attendance_logs (student_id, event_type) VALUES ($1,$2)', [student_id, nextEvent]);
  res.json({
    success: true,
    student_name: student.rows[0].full_name,
    event_type: nextEvent,
    message_to_guardian: nextEvent === 'check-in'
      ? `تم تسجيل دخول الطالب ${student.rows[0].full_name} إلى المركز.`
      : `تم تسجيل خروج الطالب ${student.rows[0].full_name} من المركز.`
  });
});
export default router;