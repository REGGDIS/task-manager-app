// Crear una nueva tarea
export function createTask(taskText) {
    return {
        id: Date.now(),
        text: taskText,
        completed: false,
    };
}

// Marcar una tarea como completada
export function toggleTaskComplete(task) {
    task.completed = !task.completed; // Cambia el estado de completado
}

// Eliminar una tarea del array
export function deleteTask(tasks, taskId) {
    return tasks.filter(task => task.id !== taskId);
}