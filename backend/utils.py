# backend/app/utils.py
import os
from dotenv import load_dotenv
import smtplib
from email.message import EmailMessage

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT") or 587)
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL") or SMTP_USER or "noreply@example.com"
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL") or FROM_EMAIL  # ← correo al que se enviará la notificación


def try_send_email(subject: str, body: str, to: str) -> bool:
    """
    Intenta enviar un correo. Si no hay configuración SMTP, devuelve False.
    No lanza excepción para no romper la API en caso de fallo de correo.
    """
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        # SMTP no configurado: fallback no bloqueante
        print("SMTP no configurado. Saltando envío de correo.")
        print("To:", to)
        print("Subject:", subject)
        print(body)
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = to
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as s:
            s.starttls()
            s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)
        return True
    except Exception as e:
        print("Error enviando email:", e)
        return False


# ----------------------------------------
# NUEVA FUNCIÓN: Notificar reserva de cita
# ----------------------------------------
def notify_new_booking(nombre: str, correo: str, servicio: str, fecha: str, hora: str):
    """
    Envía un correo al administrador cuando un cliente crea una nueva cita.
    Usa el sistema de correo ya configurado.
    """
    subject = f"📅 Nueva cita reservada: {nombre}"
    body = (
        f"Has recibido una nueva reserva en tu salón:\n\n"
        f"👤 Nombre: {nombre}\n"
        f"📧 Correo: {correo}\n"
        f"💇 Servicio: {servicio}\n"
        f"📆 Fecha: {fecha}\n"
        f"⏰ Hora: {hora}\n\n"
        f"Por favor, confirma esta cita con la clienta."
    )

    # Enviar notificación al correo de la peluquería
    result = try_send_email(subject, body, ADMIN_EMAIL)

    # (Opcional) Enviar confirmación al cliente
    confirm_body = (
        f"Hola {nombre},\n\n"
        f"Tu cita para '{servicio}' ha sido registrada correctamente:\n"
        f"📆 {fecha} a las {hora}\n\n"
        f"Gracias por confiar en nosotros 💇‍♀️"
    )
    try_send_email("Confirmación de tu cita", confirm_body, correo)

    return result
