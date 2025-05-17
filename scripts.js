/*====================
    STATE & DATA
====================*/

import { initialTasks } from "./initialData.js";
const data = [...initialTasks];
let currentTask = null;

/* CACHE DOM - MODAL OVERLAY */
const modalOverlay = document.getElementById("modal-overlay");

/*====================
    RENDER LOGIC
====================*/

/* CACHE DOM - COLUMNS */
const todoTasksContainer = document.getElementById("todo-tasks-container");
const doingTasksContainer = document.getElementById("doing-tasks-container");
const doneTasksContainer = document.getElementById("done-tasks-container");
const numTasksTodo = document.getElementById("num-tasks-todo");
const numTasksDoing = document.getElementById("num-tasks-doing");
const numTasksDone = document.getElementById("num-tasks-done");

/**
 * Rebuilds the task columns in the DOM based on current data
 * @returns {void}
 */
const renderData = () => {

    // Clear containers before re-rendering
    todoTasksContainer.innerHTML = "";
    doingTasksContainer.innerHTML = "";
    doneTasksContainer.innerHTML = "";

    // Separate tasks by status
    const todoTasks = data.filter(task => task.status === "todo");
    const doingTasks = data.filter(task => task.status === "doing");
    const doneTasks = data.filter(task => task.status === "done");

    // Update total number tasks in columns heading
    numTasksTodo.textContent = `(${todoTasks.length})`;
    numTasksDoing.textContent = `(${doingTasks.length})`;
    numTasksDone.textContent = `(${doneTasks.length})`;

    /**
     * Creates and updates a task DIV and runs its click handler
     * @param {{id:number,title:string,description:string,status:string}} typeTask - The task to render
     * @param {HTMLElement} container - The column container element
     * @returns {HTMLElement} The created task element
     */
    const renderTasks = ((typeTask,container) => {
        
        typeTask.forEach (task => {
        
            const div = document.createElement("div");
            div.textContent = task.title;
            div.classList.add("task-div");
            container.append(div);
        
            // Open modal with its content when item clicked
            div.addEventListener("click", () => {
                loadClickedModal (task);
            })
        })
    });

    // Render each status to its column container
    renderTasks(todoTasks,todoTasksContainer);
    renderTasks(doingTasks,doingTasksContainer);
    renderTasks(doneTasks,doneTasksContainer);
}

/*====================
    LOAD CLICKED TASK
====================*/

/* CACHE DOM - EDIT TASK */
const editTaskModal = document.querySelector(".edit-task-modal");
const editModalCloseBtn = editTaskModal.querySelector(".modal-close-btn");
const editTaskTitle = document.getElementById("edit-title");
const editTaskDescription = document.getElementById("edit-description");
const editTaskStatus = document.getElementById("edit-status");

/**
 * Opens the edit modal and fills its fields with the given task data
 * @param {{id:number,title:string,description:string,status:string}} task - The task to load into the modal
 * @returns {void}
*/
const loadClickedModal = (task) => {
    editTaskTitle.value = task.title;
    editTaskDescription.value = task.description;
    editTaskStatus.value = task.status;
    openModal (editTaskModal);
    currentTask = task;
}

// Close 'edit task' modal
editModalCloseBtn.addEventListener("click", () => {
    closeModal (editTaskModal);
})

/*====================
    SAVE CHANGES - BUTTON
====================*/

/* CACHE DOM - SAVE BUTTON */
const saveChangesBtn = document.getElementById("save-changes-btn");

saveChangesBtn.addEventListener("click", (event) => {
    onSavedTask (event);
})

/**
 * Handles the 'Save Changes' button click: validates inputs, updates the task, and re-renders.
 * @param {MouseEvent} event - Click event from the Save button
 * @returns {void}
 */
const onSavedTask = (event) => {
    event.preventDefault();

    // Update task properties based on modal data
    if (currentTask) {
        currentTask.title = editTaskTitle.value;
        currentTask.description = editTaskDescription.value;
        currentTask.status = editTaskStatus.value;
    }

    closeModal (editTaskModal);
    renderData ();
}

/*====================
    DELETE TASK - BUTTON
====================*/

/* CACHE DOM - DELETE BUTTON */
const deleteTaskBtn = document.getElementById("delete-task-btn");

deleteTaskBtn.addEventListener("click", (event) => {
    onDeleteTask (event);
})

/**
 * Handles the 'Delete Task' button click: deletes the current task and re-renders.
 * @param {MouseEvent} event - Click event from the Delete button.
 * @returns {void}
 */
const onDeleteTask = (event) => {

    event.preventDefault();

    // Delete correct task from data and DOM
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
}

/*====================
    ADD NEW TASK - BUTTON
====================*/

/* CACHE DOM - ADD NEW TASK */
const openAddTaskButton = document.getElementById("desktop-add-task-btn");
const addTaskModal = document.querySelector(".add-new-task-modal");
const addModalCloseBtn = addTaskModal.querySelector(".modal-close-btn");
const addTaskTitle = document.getElementById("add-new-task-title");
const addTaskDescription = document.getElementById("add-new-task-description");
const addTaskStatus = document.getElementById("add-new-task-status");
const addNewTaskButton = document.getElementById("add-new-task-btn");

// Open 'add new task' modal
openAddTaskButton.addEventListener("click", () => {
    openModal (addTaskModal);
})

// Close 'add new task' modal
addModalCloseBtn.addEventListener("click", () => {
    closeModal (addTaskModal);
})

let taskId = 6;

addNewTaskButton.addEventListener("click", (event) => {
    onAddNewTask (event);
});

/**
 * Handles the 'Add New Task' button click: validates and pushes a new task into data
 * @param {MouseEvent} event - Click event from the Add New Task button
 * @returns {void}
 */
const onAddNewTask = (event) => {

    event.preventDefault();

    const newTaskTitle = addTaskTitle.value;
    const newTaskDescription = addTaskDescription.value;
    const newTaskStatus = addTaskStatus.value;

    if (newTaskTitle.trim() === "") {
        alert("Please enter a task title")
    } else {
        data.push({
            id: taskId++,
            title: newTaskTitle,
            description: newTaskDescription,
            status: newTaskStatus
        })

        closeModal(addTaskModal);
    }

    renderData();
    
    addTaskTitle.value = "";
    addTaskDescription.value = "";
}

/*====================
    DESKTOP SIDEBAR - BUTTONS
====================*/

/* CACHE DOM - SIDEBAR */
const hideSidebarBtn = document.getElementById("sidebar-toggle-container");
const showSidebarIcon = document.getElementById("icon-hide-menu");
const sidebar = document.querySelector(".side-bar");

// Hide sidebar
hideSidebarBtn.addEventListener("click", () => {
    onHideSidebar ();
})

// Show sidebar
showSidebarIcon.addEventListener("click", () => {
    onShowSidebar ();
})

/**
 * Hides the sidebar and shows the 'open' icon.
 * @returns {void}
 */
const onHideSidebar = () => {
  sidebar.style.display = "none";
  showSidebarIcon.style.display = "flex";
}

/**
 * Shows the sidebar and hides the “open” icon.
 * @returns {void}
 */
function onShowSidebar() {
  sidebar.style.display = "flex";
  showSidebarIcon.style.display = "none";
}

/*====================
    MOBILE MODAL
====================*/

/* CACHE DOM - MOBILE SIDEBAR */
const mobileLogoIcons = document.querySelectorAll(".logo-mobile");
const mobileModal = document.getElementById("mobile-menu-modal");
const mobileModalCloseBtn = document.getElementById("mobile-modal-close-btn");

// Open modal when clicked
mobileLogoIcons.forEach (icon => {
    icon.addEventListener("click", () => {
        openModal (mobileModal);
    })
})

// Close mobile modal when button clicked
mobileModalCloseBtn.addEventListener("click", () => {
    closeModal(mobileModal);
})

// Close overlay when mobile modal is closed and resized
window.addEventListener("resize", () => {
  if (window.innerWidth > 1023) {
    // close the mobile menu and its overlay
    closeModal(mobileModal);
  }
})

/*====================
    CLOSE OVERLAY BY PRESSING BACKGROUND
====================*/

modalOverlay.addEventListener("click", () => {
    closeModal(editTaskModal);
    closeModal(addTaskModal);
    closeModal(mobileModal);
})

/*====================
    THEME SWITCH
====================*/

/* CACHE DOM - THEME SWITCH */
const themeSwitchCircle = document.querySelector(".switch-circle");
const themeSwitchButton = document.querySelector(".toggle-theme-btn");
const themeSwitchCircleMobile = document.getElementById("dark-mode-mobile-circle");
const themeSwitchButtonMobile = document.getElementById("dark-mode-theme-btn");

let isDarkMode = false;

const toggleTheme = () => {
    themeToggle ();
}

/**
    * Toggles between 'light and dark mode', updating the user interface.
    * @returns {void}
 */
const themeToggle = () => {

    // Toggle dark mode between true and false
    isDarkMode = !isDarkMode;

    // Update circle and body 
    themeSwitchCircle.classList.toggle("theme-dark-clicked");
    themeSwitchCircleMobile.classList.toggle("theme-dark-clicked",isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);

    // Sidebar logos and text
    document.getElementById("logo").style.display = isDarkMode ? "none" : "flex";
    document.getElementById("dark-logo").style.display = isDarkMode ? "flex" : "none";
    document.getElementById("close-sidebar-text").style.color = isDarkMode ? "#FFFFFF" : "#635FC7";

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
    OPEN & CLOSE MODAL
====================*/

/**
 * Hides the overlay and specific modal element
 * @param {HTMLElement} typeOfModal - The modal element to hide
 * @returns {void}
 */
const closeModal = (typeOfModal) => {
    modalOverlay.style.display = "none";
    typeOfModal.style.display = "none";
}

/**
 * Displays the overlay and specific modal element
 * @param {HTMLElement} typeOfModal - The modal modal element to show
 * @returns {void}
 */
const openModal = (typeOfModal) => {
    modalOverlay.style.display = "block";
    typeOfModal.style.display = "block";
}

/*====================
    INITIAL RENDER
====================*/

renderData();