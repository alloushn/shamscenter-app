CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    parent_name VARCHAR(200),
    phone VARCHAR(50),
    stage VARCHAR(50),
    grade VARCHAR(50),
    registration_date DATE,
    monthly_fee NUMERIC(12,2) DEFAULT 0,
    registration_fee NUMERIC(12,2) DEFAULT 0,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    months_due INTEGER DEFAULT 0,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    period_label VARCHAR(100),
    method VARCHAR(50),
    amount NUMERIC(12,2) NOT NULL,
    receiver_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    expense_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    payment_method VARCHAR(50),
    amount NUMERIC(12,2) NOT NULL,
    beneficiary VARCHAR(150),
    is_cheque BOOLEAN DEFAULT FALSE,
    cheque_no VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
    complaint_date DATE NOT NULL,
    complaint_type VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'open',
    action_taken TEXT,
    closed_at DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_logs (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
    message_type VARCHAR(100),
    message_body TEXT,
    channel VARCHAR(50),
    sent_at TIMESTAMP DEFAULT NOW(),
    sent_by VARCHAR(100)
);
