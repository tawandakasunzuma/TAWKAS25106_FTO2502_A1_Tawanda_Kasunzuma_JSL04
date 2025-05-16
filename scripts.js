/*====================
    STATE & DATA
====================*/

import { initialTasks } from "./initialData.js";
const data = [...initialTasks];
let currentTask = null;

/*====================
    DOM CACHE
====================*/

// Columns
const todoTasksContainer = document.getElementById("todo-tasks-container");
const doingTasksContainer = document.getElementById("doing-tasks-container");
const doneTasksContainer = document.getElementById("done-tasks-container");
const numTasksTodo = document.getElementById("num-tasks-todo");
const numTasksDoing = document.getElementById("num-tasks-doing");
const numTasksDone = document.getElementById("num-tasks-done");

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
    RENDER LOGIC
====================*/

function renderData () {

    // Clear containers before re-rendering
    todoTasksContainer.innerHTML = "";
    doingTasksContainer.innerHTML = "";
    doneTasksContainer.innerHTML = "";

    // Separate tasks by status
    const todoTasks = data.filter(task => task.status === "todo");
    const doingTasks = data.filter(task => task.status === "doing");
    const doneTasks = data.filter(task => task.status === "done");

    // Update total number tasks in columns heading
    numTasksTodo.textContent = `(${todoTasks.length})`
    numTasksDoing.textContent = `(${doingTasks.length})`
    numTasksDone.textContent = `(${doneTasks.length})`

    // Render tasks to DOM in correct containers
    const renderTasks = ((typeTask,container) => {
        
        typeTask.forEach (task => {
        
            // Create div, update it and add it to DOM
            const div = document.createElement("div");
            div.textContent = task.title;
            div.classList.add("task-div");
            container.append(div);
        
            // Open modal and update its content
            div.addEventListener("click", () => {
                editTaskTitle.value = task.title;
                editTaskDescription.value = task.description;
                editTaskStatus.value = task.status;
                openModal ();
                
                // Set current task
                currentTask = task;
            })
        })
    });

    // Render each status to its column container
    renderTasks(todoTasks,todoTasksContainer);
    renderTasks(doingTasks,doingTasksContainer);
    renderTasks(doneTasks,doneTasksContainer);
}

/*====================
    SAVE CHANGES BUTTON
====================*/

saveChangesBtn.addEventListener("click", (event) => {

    event.preventDefault();

    // Update task properties based on modal data
    if (currentTask) {
        currentTask.title = editTaskTitle.value;
        currentTask.description = editTaskDescription.value;
        currentTask.status = editTaskStatus.value;
    }

    closeModal ();
    renderData();
})

/*====================
    DELETE TASK BUTTON
====================*/

deleteTaskBtn.addEventListener("click", (event) => {

    event.preventDefault();

    // Delete correct task from data
    if (currentTask) {
        const currentId = data.findIndex(task => task.id === currentTask.id);
        if (currentId !== -1) {
            data.splice(currentId,1)
        }
        
        // Clear reference
        currentTask = null;
    }

    closeModal();
    renderData();
})

/*====================
    CLOSE MODAL BUTTONS
====================*/

modalCloseBtn.addEventListener("click", () => {
    closeModal ();
})

/*====================
    FUNCTIONS
====================*/

/*** Open modal */
const closeModal = () => {
    modalOverlay.style.display = "none";
    editTaskModal.style.display = "none";
}

/*** Close modal */
const openModal = () => {
    modalOverlay.style.display = "block";
    editTaskModal.style.display = "block";
}

/*====================
    INITIAL RENDER
====================*/

renderData();