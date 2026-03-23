from datetime import date
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Shams API", version="0.1.0")


class StudentIn(BaseModel):
    student_code: str
    full_name: str
    parent_name: str | None = None
    phone: str | None = None
    stage: str | None = None
    grade: str | None = None
    registration_date: date | None = None
    monthly_fee: float = 0
    registration_fee: float = 0
    discount_amount: float = 0
    months_due: int = 0
    notes: str | None = None


class PaymentIn(BaseModel):
    student_id: int
    payment_date: date
    period_label: str | None = None
    method: str | None = None
    amount: float
    receiver_name: str | None = None
    notes: str | None = None


@app.get("/health")
def health():
    return {"status": "ok", "service": "shams"}


@app.get("/api/dashboard/summary")
def dashboard_summary():
    # TODO: replace with real DB aggregation
    return {
        "students_count": 0,
        "total_due": 0,
        "total_paid": 0,
        "total_expenses": 0,
        "net_cash": 0,
        "open_complaints": 0,
    }


@app.get("/api/students")
def list_students():
    # TODO: replace with DB query + filters
    return []


@app.post("/api/students")
def create_student(payload: StudentIn):
    # TODO: insert into DB
    return {"message": "student created (stub)", "data": payload.model_dump()}


@app.get("/api/students/{student_id}")
def get_student(student_id: int):
    # TODO: fetch student card from DB
    return {"student_id": student_id, "payments": [], "complaints": []}


@app.post("/api/payments")
def create_payment(payload: PaymentIn):
    return {"message": "payment created (stub)", "data": payload.model_dump()}


@app.post("/api/messages/preview")
def preview_message(student_name: str, parent_name: str, balance: float):
    body = f"مرحباً {parent_name}، نذكركم بأن رصيد الطالب/ة {student_name} الحالي هو {balance} د.أ. شاكرين تعاونكم. - شمس"
    return {"message_body": body}
