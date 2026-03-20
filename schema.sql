CREATE TABLE IF NOT EXISTS guardians (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  phone_primary VARCHAR(30) NOT NULL,
  phone_secondary VARCHAR(30),
  relation VARCHAR(50),
  preferred_channel VARCHAR(20) DEFAULT 'whatsapp',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  grade VARCHAR(50) NOT NULL,
  photo_url TEXT,
  status VARCHAR(30) DEFAULT 'active',
  notes TEXT,
  guardian_id INTEGER REFERENCES guardians(id) ON DELETE SET NULL,
  subscription_type VARCHAR(30) NOT NULL,
  subscription_price NUMERIC(10,2) DEFAULT 0,
  sessions_count INTEGER DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  qr_code_data_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS attendance_logs (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('check-in','check-out')),
  logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);