/*====================
    Import data
====================*/

import { initialTasks } from "./initialData.js";
const data = [...initialTasks];

// Track current edited task and DOM element
let currentTask = null;

/*====================
    Cache modals
====================*/

// Modal overlay
const modalOverlay = document.getElementById("modal-overlay");

// Edit task modal
const editTaskModal = document.querySelector(".edit-task-modal");
const modalCloseBtn = document.querySelector(".modal-close-btn");
const editTaskTitle = document.getElementById("edit-title");
const editTaskDescription = document.getElementById("edit-description");
const editTaskStatus = document.getElementById("edit-status");
const saveChangesBtn = document.getElementById("save-changes-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");

/*====================
    Render data
====================*/

function renderData () {

    // Cache the tasks containers
    const todoTasksContainer = document.getElementById("todo-tasks-container");
    const doingTasksContainer = document.getElementById("doing-tasks-container");
    const doneTasksContainer = document.getElementById("done-tasks-container");

    // Clear containers before re-rendering
    todoTasksContainer.innerHTML = "";
    doingTasksContainer.innerHTML = "";
    doneTasksContainer.innerHTML = "";

    // Separate tasks by status
    const todoTasks = data.filter(task => task.status === "todo");
    const doingTasks = data.filter(task => task.status === "doing");
    const doneTasks = data.filter(task => task.status === "done");

    // Update total tasks in columns
    const numTasksTodo = document.getElementById("num-tasks-todo");
    const numTasksDoing = document.getElementById("num-tasks-doing");
    const numTasksDone = document.getElementById("num-tasks-done");
    numTasksTodo.textContent = `(${todoTasks.length})`
    numTasksDoing.textContent = `(${doingTasks.length})`
    numTasksDone.textContent = `(${doneTasks.length})`

    // Render tasks to DOM in correct containers
    const renderTasks = ((typeTask,container) => {
        // Loop through type of task
        typeTask.forEach (task => {
            
            const div = document.createElement("div");
            div.textContent = task.title;
            div.classList.add("task-div");
            container.append(div);
            
            // Open task modal
            div.addEventListener("click", () => {

                // Show overlay and popup edit modal
                modalOverlay.style.display = "block";
                editTaskModal.style.display = "block";

                // Show details on edit modal 
                editTaskTitle.value = task.title;
                editTaskDescription.value = task.description;
                editTaskStatus.value = task.status;

                // Set current task
                currentTask = task;
            })
        })
    });

    renderTasks(todoTasks,todoTasksContainer);
    renderTasks(doingTasks,doingTasksContainer);
    renderTasks(doneTasks,doneTasksContainer);
}

// Save changes button
saveChangesBtn.addEventListener("click", (event) => {
    event.preventDefault();
    // Update current task
    if (currentTask) {
        // Update task properties based on modal data
        currentTask.title = editTaskTitle.value;
        currentTask.description = editTaskDescription.value;
        currentTask.status = editTaskStatus.value;
    }

    // Close the modal
    modalOverlay.style.display = "none";
    editTaskModal.style.display = "none";

    // Re render everything with updated data
    renderData();
})

// Close modal button
modalCloseBtn.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    editTaskModal.style.display = "none";
})

// Delete task button
deleteTaskBtn.addEventListener("click", (event) => {
    // Stop form submission
    event.preventDefault();
    if (currentTask) {
        // Find index of item clicked
        const currentId = data.findIndex(task => task.id === currentTask.id);
        // Delete item from data array
        if (currentId !== -1) {
            data.splice(currentId,1)
        }
        // Clear reference
        currentTask = null;
    }

    // Close the modal
    modalOverlay.style.display = "none";
    editTaskModal.style.display = "none";

    // Re render everything with updated data
    renderData();
})

// Initial render
renderData();