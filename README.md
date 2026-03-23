# Shams Web Starter

حزمة بداية عملية لتحويل ملف **Shams_System_v1.xlsx** إلى نظام ويب حقيقي.

## المحتويات
- `schema.sql` : الجداول الأساسية.
- `app/main.py` : تطبيق FastAPI أولي.
- `requirements.txt` : المكتبات المطلوبة.
- `.env.example` : متغيرات البيئة.

## الخطوات السريعة
1. أنشئ قاعدة PostgreSQL.
2. نفّذ `schema.sql`.
3. ثبّت المتطلبات:
   ```bash
   pip install -r requirements.txt
   ```
4. شغّل التطبيق:
   ```bash
   uvicorn app.main:app --reload
   ```
5. افتح:
   - Swagger: `http://127.0.0.1:8000/docs`
   - Health: `http://127.0.0.1:8000/health`

## المطلوب لاحقاً
- ربط حقيقي بقاعدة البيانات عبر SQLAlchemy.
- نظام تسجيل دخول وصلاحيات.
- واجهة إدارة (React/Vue أو Jinja templates).
- إرسال WhatsApp/SMS عبر مزود خارجي.
- استيراد بيانات Excel إلى قاعدة البيانات.
