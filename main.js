// Ejemplo de envío de formularios sin backend real
document.getElementById('reservaForm').addEventListener('submit', function(e){
    e.preventDefault();
    alert('Reserva enviada correctamente. Nos pondremos en contacto.');
    this.reset();
});

document.getElementById('contactoForm').addEventListener('submit', function(e){
    e.preventDefault();
    alert('Mensaje enviado correctamente. Gracias por contactarnos.');
    this.reset();
});

// Botones de tienda
const btnsPedido = document.querySelectorAll('#tienda .btn');
btnsPedido.forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Pedido recibido. Contactaremos para confirmar.');
    });
});
