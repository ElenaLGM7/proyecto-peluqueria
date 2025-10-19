from database import get_connection

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100),
            message TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100),
            phone VARCHAR(20),
            service VARCHAR(100),
            date DATE,
            time TIME
        );
    """)
    conn.commit()
    cursor.close()
    conn.close()

# Inicializar DB al arrancar
init_db()
