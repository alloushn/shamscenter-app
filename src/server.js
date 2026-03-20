import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dashboardRouter from './routes/dashboard.js';
import studentsRouter from './routes/students.js';
import attendanceRouter from './routes/attendance.js';
import paymentsRouter from './routes/payments.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (_req, res) => res.json({ ok: true, app: process.env.APP_NAME || 'Shams Center' }));
app.use('/api/dashboard', dashboardRouter);
app.use('/api/students', studentsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/payments', paymentsRouter);

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

app.listen(port, () => console.log(`Server running on port ${port}`));