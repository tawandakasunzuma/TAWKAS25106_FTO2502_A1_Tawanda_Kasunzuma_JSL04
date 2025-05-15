import { initialTasks } from "./initialData.js";

function renderData () {
    // Assign imported data
    const data = initialTasks;

    // Cache the tasks containers
    const todoTasksContainer = document.getElementById("todo-tasks-container");
    const doingTasksContainer = document.getElementById("doing-tasks-container");
    const doneTasksContainer = document.getElementById("done-tasks-container");

    // Separate tasks by status
    const todoTasks = data.filter(task => task.status === "todo");
    const doingTasks = data.filter(task => task.status === "doing");
    const doneTasks = data.filter(task => task.status === "done");

    // Render tasks to DOM in correct containers
    const renderTasks = ((tasks,container) => {
        tasks.forEach (task => {
            const div = document.createElement("div");
            div.textContent = task.title;
            div.classList.add("task-div");
            container.append(div);
        })
    });
    
    renderTasks(todoTasks,todoTasksContainer);
    renderTasks(doingTasks,doingTasksContainer);
    renderTasks(doneTasks,doneTasksContainer);
}

renderData();