(function () {
  let tasks = [];
  const taskList = document.getElementById("list");
  const addTaskInput = document.getElementById("add");
  const tasksCounter = document.getElementById("tasks-counter");

  console.log("Working");

  async function fetchTodo() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      tasks = data.slice(0, 5);
      renderList();
    } catch (error) {
      console.log(error);
    }
  }

  function addTaskToDOM(task) {
    const li = document.createElement("li");

    li.innerHTML = `
  <input type="checkbox" id="${task.id}" ${
      task.completed ? "checked" : " "
    } class="custom-checkbox">
  <label for="${task.id}">${task.title}</label>
   <span class="material-symbols-outlined" id="delete" data-id="${
     task.id
   }" > delete </span>
  `;

    taskList.append(li);
  }
  {
    // <img src="bin.svg" class="delete" data-id="${task.id}" />
  }

  function renderList() {
    taskList.innerHTML = "";
    for (let i = 0; i < tasks.length; i++) {
      const element = tasks[i];
      addTaskToDOM(element);
    }
    tasksCounter.innerHTML = tasks.length;
  }

  function toggleTask(taskId) {
    const task = tasks.filter((task) => {
      return task.id === Number(taskId);
    });
    if (task.length != 0) {
      const currentTask = task[0];
      // this line will revert the status
      currentTask.completed = !currentTask.completed;
      renderList();
      showNotification("Task Toggled Successfully");
      return;
    }
    showNotification("Could not Toggle Task");
  }

  function deleteTask(taskId) {
    // filter the array based on whose id is not equal to taskID this will keep only those matching the condition
    // filter function will return an array

    const newTasks = tasks.filter((task) => {
      return task.id !== Number(taskId);
    });
    tasks = newTasks;
    renderList();
    showNotification("Task Deleted Successfully");
    return;
  }

  function addTask(task) {
    if (task) {
      fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          tasks.push(task);
          renderList();
          showNotification("Task Added Successfully ");
          // markTaskAsComplete(task.id);
          // return;
        })
        .catch(function (error) {
          console.log(error);
        });
      // tasks.push(task);
      // renderList();
      // showNotification("Task Added Successfully ");
      // // markTaskAsComplete(task.id);
      // return;
    }
    showNotification("Task Could Not be added");
  }

  function showNotification(text) {
    alert(text);
  }

  function handleInputKeypress(e) {
    // log the data if enter is pressed
    if (e.key === "Enter") {
      const text = e.target.value;
      console.log(text);
      // check the input text is not empty
      if (!text) {
        showNotification("Please Enter a Valid Task!");
        return;
      }
      // create a task object
      let task = {
        title: text,
        id: Date.now(),
        completed: false,
      };

      // add the created task
      addTask(task);
      // Set the value of Input box back to Empty string
      e.target.value = "";
    }
  }
  function handleClickEvent(event) {
    const target = event.target;
    // console.log(target);
    // console.log(target.className);

    // handle the clicks
    if (target.className === "material-symbols-outlined") {
      const taskId = target.dataset.id;
      // console.log(taskId);
      deleteTask(taskId);
      return;
    } else if (target.className === "custom-checkbox") {
      const taskId = target.id;
      // console.log(taskId);
      toggleTask(taskId);
      return;
    }
  }
  // this is global event Delegation
  function initializeToDo() {
    fetchTodo();
    document.addEventListener("click", handleClickEvent);
    addTaskInput.addEventListener("keyup", handleInputKeypress);
  }
  initializeToDo();
})();
