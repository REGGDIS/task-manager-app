import { saveTasks, loadTasks } from './storage.js';
import { createTask, toggleTaskComplete, deleteTask } from './taskManager.js';
import { renderTaskList } from './domManipulation.js';
import { showError } from './errorHandler.js';

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
        showError('La tarea es demasiado larga (máximo 50 caracteres)');
        return; // Detener ejecución si el texto es demasiado largo
    }

    // Validar que no haya duplicados
    if (tasks.some(task => task.text.trim() === taskText)) {
        showError('Esta tarea ya existe');
        return;
    }

    const newTask = createTask(taskText); // Crear una nueva tarea
    tasks.push(newTask); // Agregar la tarea al array de tareas
    saveTasks(tasks); // Guardar las tareas en LocalStorage
    renderTaskList(taskListElement, tasks, handleToggleComplete, handleDeleteTask); // Renderizar la lista actualizada

    inputElement.value = ''; // Limpiar el campo del input
}

// Función para manejar el marcado de tareas como completadas
function handleToggleComplete(task) {
    toggleTaskComplete(task); // Cambiar el estado de completado
    saveTasks(tasks); // Guardar los cambios en LocalStorage
    renderTaskList(taskListElement, tasks, handleToggleComplete, handleDeleteTask); // Renderizar la lista actualizada
}

// Función para manejar la eliminación de tareas
function handleDeleteTask(taskId) {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
        tasks.splice(index, 1); // Eliminar la tarea del array
        saveTasks(tasks); // Guardar los cambios en LocalStorage
        renderTaskList(taskListElement, tasks, handleToggleComplete, handleDeleteTask); // Renderizar la lista actualizada
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

// Eventos para los botones de filtro
document.getElementById('filter-all').addEventListener('click', () => filterTasks('all'));
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
    renderTaskList(taskListElement, tasks, handleToggleComplete, handleDeleteTask); // Renderizar la lista inicial
}

initApp();