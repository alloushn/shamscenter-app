import { Router } from 'express';
import { pool } from '../db/pool.js';
const router = Router();
router.post('/', async (req, res) => {
  const { student_id, amount, payment_method, payment_date, notes } = req.body;
  const result = await pool.query(`
    INSERT INTO payments (student_id, amount, payment_method, payment_date, notes)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `, [student_id, amount, payment_method, payment_date, notes || null]);
  res.status(201).json(result.rows[0]);
});
export default router;