// Crear un elemento de tarea y agregarlo al DOM
export function renderTask(task, toggleCompleteCallback, deleteCallback) {
    const li = document.createElement('li');
    li.classList.add('task');
    if (task.completed) li.classList.add('completed'); // Si la tarea está completada añade la clase 'completed'

    const span = document.createElement('span');
    span.textContent = task.text;
    span.setAttribute('tabindex', '0'); // Hacer el texto accesible
    span.setAttribute('role', 'button'); // Indicar que es un botón
    span.addEventListener('click', () => toggleCompleteCallback(task)); // Al hacer clic, cambia el estado
    span.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { // Soporte para Enter o Espacio
            toggleCompleteCallback(task); // Cambia el estado al presionar Enter o Espacio
        }
    });

    const button = document.createElement('button');
    button.classList.add('delete');
    button.textContent = 'X';
    button.setAttribute('aria-label', 'Eliminar tarea');
    button.addEventListener('click', () => deleteCallback(task.id));

    li.appendChild(span);
    li.appendChild(button);

    return li;
}

// Renderizar la lista completa de tareas
export function renderTaskList(taskListElement, tasks, toggleCompleteCallback, deleteCallback) {
    taskListElement.innerHTML = ''; // Limpiar el contenido actual

    const fragment = document.createDocumentFragment(); // Usar fragmento para optimizar la manipulación del DOM
    tasks.forEach(task => {
        const taskElement = renderTask(task, toggleCompleteCallback, deleteCallback);
        fragment.appendChild(taskElement);
    });

    taskListElement.appendChild(fragment);
}