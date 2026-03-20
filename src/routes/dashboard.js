import { Router } from 'express';
import { pool } from '../db/pool.js';
const router = Router();
router.get('/', async (_req, res) => {
  const [students, active, revenue, inside] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS count FROM students'),
    pool.query("SELECT COUNT(*)::int AS count FROM students WHERE status='active'"),
    pool.query('SELECT COALESCE(SUM(amount),0)::numeric AS total FROM payments'),
    pool.query(`SELECT COUNT(*)::int AS count FROM (
      SELECT student_id, (ARRAY_AGG(event_type ORDER BY logged_at DESC))[1] AS last_event
      FROM attendance_logs GROUP BY student_id
    ) x WHERE last_event='check-in'`)
  ]);
  res.json({
    totalStudents: students.rows[0].count,
    activeStudents: active.rows[0].count,
    totalRevenue: Number(revenue.rows[0].total),
    studentsInside: inside.rows[0].count
  });
});
export default router;