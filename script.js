// Array to store tasks
let tasks = [];
let searchQuery = "";
let currentFilter = "all"; // all, active, completed
let currentSort = "az"; // az, za

// Function to add a new task
function addTask(taskText) {
    if (!taskText.trim()) {
        alert("Task cannot be empty!");
        return;
    }

    const newTask = {
        text: taskText.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();
}

// Function to delete a task
function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        saveToLocalStorage();
        renderTasks();
    }
}

// Function to toggle task completion
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveToLocalStorage();
    renderTasks();
}

// Function to clear completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed); // Keep only tasks that are not completed
    saveToLocalStorage(); // Save the updated tasks to local storage
    renderTasks(); // Re-render the task list
}

// Function to filter, search, and sort tasks (derived state approach)
// Function to filter, search, and sort tasks (derived state approach)
function getFilteredAndSortedTasks() {
    // Filter tasks based on the current filter
    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true; // "all" filter
    });

    // Search tasks based on the search query
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Sort tasks based on the current sort option
    filteredTasks = filteredTasks.slice().sort((a, b) => {
        if (currentSort === "az") {
            return a.text.localeCompare(b.text);
        } else if (currentSort === "za") {
            return b.text.localeCompare(a.text);
        } else if (currentSort === "newest") {
            return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
        } else if (currentSort === "oldest") {
            return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
        }
        return 0; // Default: no sorting
    });

    return filteredTasks;
}   
// Function to render tasks in the UI
function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear the task list

    const derivedTasks = getFilteredAndSortedTasks();

    derivedTasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        taskItem.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}">
            <span class="${task.completed ? "completed" : ""}">${task.text}</span>
            <button class="delete-task" data-index="${index}">Delete</button>
        `;

        taskList.appendChild(taskItem);
    });

    updateCounters();
}

// Function to save tasks to local storage
function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
        tasks = storedTasks;
        renderTasks();
    }
}

// Function to update task counters
function updateCounters() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    document.getElementById("total-tasks").innerText = totalTasks;
    document.getElementById("completed-tasks").innerText = completedTasks;
}

// Event listener for adding a task
document.getElementById("add-task-button").addEventListener("click", () => {
    const taskInput = document.getElementById("task-input");
    addTask(taskInput.value);
    taskInput.value = ""; // Clear the input field
});

// Event listener for task list (delegated for dynamic elements)
document.getElementById("task-list").addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (e.target.type === "checkbox") {
        toggleTask(index);
    } else if (e.target.classList.contains("delete-task")) {
        deleteTask(index);
    }
});

// Event listener for search input
document.getElementById("search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderTasks();
});

// Event listeners for filter buttons
document.getElementById("filter-all").addEventListener("click", () => {
    currentFilter = "all";
    renderTasks();
});

document.getElementById("filter-active").addEventListener("click", () => {
    currentFilter = "active";
    renderTasks();
});

document.getElementById("filter-completed").addEventListener("click", () => {
    currentFilter = "completed";
    renderTasks();
});

// Event listener for sort dropdown
document.getElementById("sort-tasks").addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderTasks();
});

// Event listener for the "Clear Completed" button
document.getElementById("clear-completed").addEventListener("click", clearCompletedTasks);

// Load tasks from local storage when the page loads
window.onload = loadFromLocalStorage;