// Función para mostrar mensajes de error
export function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.marginTop = '10px';
    document.getElementById('app').appendChild(errorElement);

    setTimeout(() => errorElement.remove(), 3000); // Quitar el mensaje después de 3 segundos
}