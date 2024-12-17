// Guardar tareas en LocalStorage
export function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Cargar tareas desde LocalStorage
export function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    try {
        const parsedTasks = JSON.parse(savedTasks);
        return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
        return [];
    }
}