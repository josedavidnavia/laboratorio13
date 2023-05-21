const tasks = JSON.parse(localStorage.getItem("tasks")) || {
  todo: [],
  doing: [],
  done: []
};

const addTaskForm = document.getElementById("add-task-form");
const addTaskInput = document.getElementById("add-task-input");
const todoTasksContainer = document.getElementById("todo-tasks");
const doingTasksContainer = document.getElementById("doing-tasks");
const doneTasksContainer = document.getElementById("done-tasks");

const createTask = (taskText, status) => ({
  text: taskText,
  status: status || "todo"
});

const saveTask = (task) => {
  tasks[task.status].push(task);
  updateLocalStorage();
  renderTasks();
};

const deleteTask = (task, taskIndex) => {
  tasks[task.status].splice(taskIndex, 1);
  updateLocalStorage();
  renderTasks();
};

const updateTask = (task, newStatus) => {
  const taskIndex = tasks[task.status].indexOf(task);
  tasks[task.status].splice(taskIndex, 1);
  task.status = newStatus;
  tasks[newStatus].push(task);
  updateLocalStorage();
  renderTasks();
};

const updateLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const renderTasks = () => {
  todoTasksContainer.innerHTML = "";
  doingTasksContainer.innerHTML = "";
  doneTasksContainer.innerHTML = "";

  tasks.todo.forEach((task, index) => {
    const todoTaskElement = createTaskElement(task, index);
    todoTasksContainer.appendChild(todoTaskElement);
  });

  tasks.doing.forEach((task, index) => {
    const doingTaskElement = createTaskElement(task, index);
    doingTasksContainer.appendChild(doingTaskElement);
  });

  tasks.done.forEach((task, index) => {
    const doneTaskElement = createTaskElement(task, index);
    doneTasksContainer.appendChild(doneTaskElement);
  });
};

const createTaskElement = (task, taskIndex) => {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.innerHTML = `
    <p>${task.text}</p>
    <div class="task-controls">
      ${task.status !== "todo" ? '<button class="btn up-btn">&#8593;</button>' : ""}
      ${task.status !== "done" ? '<button class="btn down-btn">&#8595;</button>' : ""}
      <button class="btn delete-btn">&#10060;</button>
    </div>
  `;

  const upBtn = taskElement.querySelector(".up-btn");
  const downBtn = taskElement.querySelector(".down-btn");
  const deleteBtn = taskElement.querySelector(".delete-btn");

  upBtn && upBtn.addEventListener("click", () => {
    updateTask(task, task.status === "doing" ? "todo" : "doing");
  });

  downBtn && downBtn.addEventListener("click", () => {
    updateTask(task, task.status === "doing" ? "done" : "doing");
  });

  deleteBtn && deleteBtn.addEventListener("click", () => {
    deleteTask(task, taskIndex);
  });

  return taskElement;
};

addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = addTaskInput.value.trim();
  if (taskText !== "") {
    const task = createTask(taskText);
    saveTask(task);
    addTaskInput.value = "";
  }
});

renderTasks();
