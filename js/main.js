import { saveTasks, loadTasks } from './storage.js';
import { createTask, toggleTaskComplete, deleteTask } from './taskManager.js';
import { renderTaskList } from './domManipulation.js';
import { showError } from './errorHandler.js';
import './pomodoroTimer.js';

// Variables globales
const tasks = loadTasks(); // Cargar las tareas guardadas en LocalStorage
const taskListElement = document.getElementById('task-list');
const inputElement = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');

// Función para manejar el agregado de una nueva tarea
function handleAddTask() {
    const taskText = inputElement.value.trim(); // Obtener y limpiar el valor del input 
    if (!taskText) return; // Salir si no hay texto en el input

    // Validar longitud del texto
    if (taskText.length > 50) {
        showNotification('La tarea es demasiado larga (máximo 50 caracteres)', 'error');
        return; // Detener ejecución si el texto es demasiado largo
    }

    // Validar que no haya duplicados
    if (tasks.some(task => task.text.trim() === taskText)) {
        showNotification('Esta tarea ya existe', 'error');
        return;
    }

    const newTask = createTask(taskText); // Crear una nueva tarea
    tasks.push(newTask); // Agregar la tarea al array de tareas
    saveTasks(tasks); // Guardar las tareas en LocalStorage
    renderTaskList(taskListElement, tasks, handleToggleComplete, handleDeleteTask); // Renderizar la lista actualizada

    showNotification('Tarea agregada con éxito');
    inputElement.value = ''; // Limpiar el campo del input
}

// Función para manejar el marcado de tareas como completadas
function handleToggleComplete(task) {
    toggleTaskComplete(task); // Cambiar el estado de completado
    saveTasks(tasks); // Guardar los cambios en LocalStorage
    renderTaskList(taskListElement, tasks, handleToggleComplete, handleDeleteTask); // Renderizar la lista actualizada
    showNotification('Tarea marcada como completada');
}

// Función para manejar la eliminación de tareas con confirmación
function handleDeleteTask(taskId) {
    const confirmation = confirm('¿Estás seguro de que quieres eliminar esta tarea?');
    if (confirmation) {
        const index = tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            tasks.splice(index, 1); // Eliminar la tarea del array
            saveTasks(tasks); // Guardar los cambios en LocalStorage
            renderTaskList(taskListElement, tasks, handleToggleComplete, handleDeleteTask); // Renderizar la lista actualizada
            showNotification('Tarea eliminada exitosamente');
        }
    } else {
        showNotification('La tarea no fue eliminada');
    }
}

// Función para filtrar y renderizar tareas
function filterTasks(filterType) {
    let filteredTasks = [];
    switch (filterType) {
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        case 'pending':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        default:
            filteredTasks = tasks; // Todas las tareas
    }
    renderTaskList(taskListElement, filteredTasks, handleToggleComplete, handleDeleteTask);
}

// Función para cambiar la apariencia del botón del filtro activoque hace l
function setActiveFilter(buttonId) {
    document.querySelectorAll('button').forEach(button => button.classList.remove('active'));
    document.getElementById(buttonId).classList.add('active');
}

// Función de notificación
function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notifications-container');

    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Eventos para los botones de filtro
document.getElementById('filter-all').addEventListener('click', () => {
    setActiveFilter('filter-all');
    filterTasks('all');
});
document.getElementById('filter-completed').addEventListener('click', () => filterTasks('completed'));
document.getElementById('filter-pending').addEventListener('click', () => filterTasks('pending'));

// Inicialización
function initApp() {
    addTaskButton.addEventListener('click', handleAddTask); // Manejar clic en "Agregar"
    inputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleAddTask(); // Agregar la tarea al presionar Enter
        }
    });
    filterTasks('all'); // Mostrar todas las tareas al inicio
    setActiveFilter('filter-all'); // Marcar "Todas" como el filtro activo
}

initApp();