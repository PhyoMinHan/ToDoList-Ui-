document.addEventListener("DOMContentLoaded", () => {
  const userTaskInput = document.querySelector(".task-input input");
  const todosList = document.querySelector(".todos-list");
  const filterButtons = document.querySelectorAll(".ctr-div span");
  const clearButton = document.querySelector(".clear-btn");

  let todos = JSON.parse(localStorage.getItem("todos-list")) || [];

  // Render tasks based on the selected filter
  function renderTodos(filter = "all") {
    todosList.innerHTML = ""; // Clear the list

    // Filter and render tasks
    const filteredTodos = todos.filter((todo) => {
      if (filter === "completed") return todo.status === "completed";
      if (filter === "pending") return todo.status === "pending";
      return true; // For "all" filter
    });

    if (filteredTodos.length === 0) {
      // Display the "No tasks to show" message if no tasks match the filter
      todosList.innerHTML =
        "<p style=display:flex;justify-content:center;align-items:center;height:30vh;opacity:0.5;>No tasks to show</p>";
      return;
    }

    // Render the filtered tasks
    filteredTodos.forEach((todo, index) => {
      const li = document.createElement("li");
      li.className = "todo-items";

      li.innerHTML = `
        <label>
          <input type="checkbox" ${
            todo.status === "completed" ? "checked" : ""
          } data-index="${index}">
          <span class="todo-txt ${
            todo.status === "completed" ? "completed" : ""
          }">${todo.task}</span>
        </label>
        <div>
          <i class="fa-solid fa-pen-to-square edit-ic" data-index="${index}"></i>
          <i class="fa-solid fa-trash delete-ic" data-index="${index}"></i>
        </div>
      `;
      todosList.appendChild(li);
    });
  }

  // Add a new task or update an existing one
  userTaskInput.addEventListener("keyup", (event) => {
    const userInput = userTaskInput.value.trim();
    const editIndex = userTaskInput.dataset.editIndex;

    if (event.key === "Enter" && userInput) {
      if (editIndex !== undefined) {
        // Update existing task
        todos[editIndex].task = userInput;
        delete userTaskInput.dataset.editIndex; // Clear edit index
      } else {
        // Add new task
        todos.push({ task: userInput, status: "pending" });
      }

      localStorage.setItem("todos-list", JSON.stringify(todos));
      userTaskInput.value = ""; // Clear input
      renderTodos(
        document.querySelector(".ctr-div span.active").textContent.toLowerCase()
      );
    }
  });

  // Toggle task status (pending/completed)
  todosList.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
      const index = event.target.dataset.index;
      todos[index].status = event.target.checked ? "completed" : "pending";
      localStorage.setItem("todos-list", JSON.stringify(todos));
      renderTodos(
        document.querySelector(".ctr-div span.active").textContent.toLowerCase()
      );
    }
  });

  // Edit a task
  todosList.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-ic")) {
      const index = event.target.dataset.index;
      const task = todos[index].task;

      // Populate input with task and focus
      userTaskInput.value = task;
      userTaskInput.focus();
      userTaskInput.dataset.editIndex = index; // Store edit index
    }
  });

  // Delete a task
  todosList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-ic")) {
      const index = event.target.dataset.index;
      todos.splice(index, 1); // Remove task
      localStorage.setItem("todos-list", JSON.stringify(todos));
      renderTodos(
        document.querySelector(".ctr-div span.active").textContent.toLowerCase()
      );
    }
  });

  // Clear all tasks
  clearButton.addEventListener("click", () => {
    todos = [];
    localStorage.setItem("todos-list", JSON.stringify(todos));
    renderTodos();
  });

  // Filter tasks (all, pending, completed)
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".ctr-div span.active").classList.remove("active");
      btn.classList.add("active");
      renderTodos(btn.textContent.toLowerCase());
    });
  });

  // Initial rendering
  renderTodos();
});
