# Belleza Studio - Backend (FastAPI)

## Qué incluye
- Endpoints para reservas (/api/bookings) y contacto (/api/contact)
- Conexión a Neon/Postgres mediante SQLModel (SQLAlchemy)
- Intento de envío de email si configuras SMTP
- Configurable vía variables de entorno (.env)

## Requisitos
- Python 3.10+
- Neon DB (DATABASE_URL)

## Instalar y ejecutar localmente
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# crear .env con DATABASE_URL y FRONTEND_URL
uvicorn app.main:app --reload --port 8000
