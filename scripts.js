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
const editModalCloseBtn = editTaskModal.querySelector(".modal-close-btn");
const editTaskTitle = document.getElementById("edit-title");
const editTaskDescription = document.getElementById("edit-description");
const editTaskStatus = document.getElementById("edit-status");
const saveChangesBtn = document.getElementById("save-changes-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");

// Add new task modal
const openAddTaskButton = document.getElementById("desktop-add-task-btn");
const addTaskModal = document.querySelector(".add-new-task-modal");
const addModalCloseBtn = addTaskModal.querySelector(".modal-close-btn");
const addTaskTitle = document.getElementById("add-new-task-title");
const addTaskDescription = document.getElementById("add-new-task-description");
const addTaskStatus = document.getElementById("add-new-task-status");
const addNewTaskButton = document.getElementById("add-new-task-btn");

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
                openModal (editTaskModal);
                
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

    closeModal (editTaskModal);
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

    closeModal(editTaskModal);
    renderData();
})

/*====================
    OPEN ADD NEW TASK BUTTON
====================*/

openAddTaskButton.addEventListener("click", () => {
    openModal (addTaskModal);
});

/*====================
    ADD NEW TASK BUTTON
====================*/

let taskId = 6;

addNewTaskButton.addEventListener("click", (event) => {
    event.preventDefault();
    const newTaskTitle = addTaskTitle.value;
    const newTaskDescription = addTaskDescription.value;
    const newTaskStatus = addTaskStatus.value;
    data.push(
        {
            id: taskId++,
            title: newTaskTitle,
            description: newTaskDescription,
            status: newTaskStatus
        }
    )
    closeModal(addTaskModal);
    console.log(data)
    renderData();
});

/*====================
    CLOSE MODAL BUTTONS
====================*/

// Close edit task modal
editModalCloseBtn.addEventListener("click", () => {
    closeModal (editTaskModal);
})

// Close add task modal
addModalCloseBtn.addEventListener("click", () => {
    closeModal (addTaskModal);
})

// Close by pressing overlay
modalOverlay.addEventListener("click", () => {
    closeModal(editTaskModal);
    closeModal(addTaskModal);
})

/*====================
    FUNCTIONS
====================*/

/*** Open modal */
const closeModal = (typeOfModal) => {
    modalOverlay.style.display = "none";
    typeOfModal.style.display = "none";
}

/*** Close modal */
const openModal = (typeOfModal) => {
    modalOverlay.style.display = "block";
    typeOfModal.style.display = "block";
}

/*====================
    INITIAL RENDER
====================*/

renderData();