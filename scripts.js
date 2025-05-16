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

// Modal - Overlay
const modalOverlay = document.getElementById("modal-overlay");

// Modal - Edit task
const editTaskModal = document.querySelector(".edit-task-modal");
const editModalCloseBtn = editTaskModal.querySelector(".modal-close-btn");
const editTaskTitle = document.getElementById("edit-title");
const editTaskDescription = document.getElementById("edit-description");
const editTaskStatus = document.getElementById("edit-status");
const saveChangesBtn = document.getElementById("save-changes-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");

// Modal - Add new task
const openAddTaskButton = document.getElementById("desktop-add-task-btn");
const addTaskModal = document.querySelector(".add-new-task-modal");
const addModalCloseBtn = addTaskModal.querySelector(".modal-close-btn");
const addTaskTitle = document.getElementById("add-new-task-title");
const addTaskDescription = document.getElementById("add-new-task-description");
const addTaskStatus = document.getElementById("add-new-task-status");
const addNewTaskButton = document.getElementById("add-new-task-btn");

// Hide sidebar
const hideSidebarBtn = document.getElementById("sidebar-toggle-container");
const showSidebarIcon = document.getElementById("icon-hide-menu");
const sidebar = document.querySelector(".side-bar");

// Mobile hide sidebar
const mobileLogoIcons = document.querySelectorAll(".logo-mobile");
const mobileModal = document.getElementById("mobile-menu-modal");
const mobileModalCloseBtn = document.getElementById("mobile-modal-close-btn");

// Theme switch
const themeSwitchCircle = document.querySelector(".switch-circle");
const themeSwitchButton = document.querySelector(".toggle-theme-btn");
const themeSwitchCircleMobile = document.getElementById("dark-mode-mobile-circle");
const themeSwitchButtonMobile = document.getElementById("dark-mode-theme-btn");

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
    SAVE CHANGES - BUTTON
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
    DELETE TASK - BUTTON
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
    OPEN ADD NEW TASK
====================*/

openAddTaskButton.addEventListener("click", () => {
    openModal (addTaskModal);
});

/*====================
    ADD NEW TASK - BUTTON
====================*/

let taskId = 6;

addNewTaskButton.addEventListener("click", (event) => {
    event.preventDefault();
    const newTaskTitle = addTaskTitle.value;
    const newTaskDescription = addTaskDescription.value;
    const newTaskStatus = addTaskStatus.value;
    if (newTaskTitle.trim() === "") {
        alert("Please enter a task title")
    } else {
        data.push(
            {
                id: taskId++,
                title: newTaskTitle,
                description: newTaskDescription,
                status: newTaskStatus
            }
        )
        closeModal(addTaskModal);
    }
    renderData();
    addTaskTitle.value = "";
    addTaskDescription.value = "";
});

/*====================
    DESKTOP CLOSE SIDEBAR - BUTTON
====================*/

hideSidebarBtn.addEventListener("click", () => {
    sidebar.style.display = "none";
    showSidebarIcon.style.display = "flex";
})

/*====================
    DESKTOP OPEN SIDEBAR - ICON
====================*/

showSidebarIcon.addEventListener("click", () => {
    sidebar.style.display = "flex";
    showSidebarIcon.style.display = "none";
})

/*====================
    CLOSE MODAL - BUTTONS
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
    closeModal(mobileModal);
})

/*====================
    MOBILE MODAL
====================*/

// Close mobile task modal
mobileModalCloseBtn.addEventListener("click", () => {
    closeModal(mobileModal);
})

mobileLogoIcons.forEach (icon => {
    icon.addEventListener("click", () => {
        if (window.innerWidth <= 1023) {
            openModal (mobileModal);
        } else {
            closeModal (mobileModal);
            modalOverlay.style.display = "none";
        }
    })
})

/*====================
    THEME SWITCH
====================*/

let isDarkMode = false;

/** Change theme function */
const toggleTheme = () => {
    // Toggle dark mode between true and false
    isDarkMode = !isDarkMode;
    // Update circle and body 
    themeSwitchCircle.classList.toggle("theme-dark-clicked");
    document.body.classList.toggle("dark", isDarkMode);
    // Sidebar logos and text
    document.getElementById("logo").style.display = isDarkMode ? "none" : "flex";
    document.getElementById("dark-logo").style.display = isDarkMode ? "flex" : "none";
    document.getElementById("close-sidebar-text").style.color = isDarkMode ? "#FFFFFF" : "#635FC7";
    // Toggle mobile circle
    themeSwitchCircleMobile.classList.toggle("theme-dark-clicked",isDarkMode);
    // Update toggle backgrounds
    document.getElementById("dark-mode-theme-btn").style.backgroundColor = isDarkMode ? "#20212C" : "#635FC7";
    document.getElementById("mobile-modal-theme-toggle").style.backgroundColor = isDarkMode ? "#635FC7" : "#f4f7fd";
}

// Desktop theme change
themeSwitchButton.addEventListener("click", () => {
    toggleTheme ();
});

// Mobile theme toggle
themeSwitchButtonMobile.addEventListener("click", () => {
    toggleTheme ();
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

/*====================
    RESIZE WINDOW
====================*/

// Close overlay when screen resizes
window.addEventListener("resize", () => {
  // if go above breaking point
  if (window.innerWidth > 1023) {
    // close the mobile menu and its overlay
    closeModal(mobileModal);
  }
});