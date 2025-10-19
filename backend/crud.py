from database import get_connection
from schemas import ContactCreate, BookingCreate

def create_contact(contact: ContactCreate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO contacts (name, email, message) VALUES (%s, %s, %s) RETURNING id, name, email, message",
        (contact.name, contact.email, contact.message)
    )
    result = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    return result

def create_booking(booking: BookingCreate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO bookings (name, email, phone, service, date, time) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, name, email, phone, service, date, time",
        (booking.name, booking.email, booking.phone, booking.service, booking.date, booking.time)
    )
    result = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    return result

def get_all_bookings():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookings ORDER BY date, time")
    results = cursor.fetchall()
    conn.close()
    return results
