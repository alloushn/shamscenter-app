# Shams Center App - MVP

هذه نسخة أولية قابلة للنشر على Railway.

## التشغيل
```bash
npm install
cp .env.example .env
npm run dev
```

## قاعدة البيانات
```bash
psql "$DATABASE_URL" -f schema.sql
```

## Railway
أضف:
- PORT=3000
- DATABASE_URL=${{ Postgres.DATABASE_URL }}
- APP_NAME=شمس - مركز المهارات الأكاديمية