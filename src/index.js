const userTaskInput = document.querySelector(".task-input input");
const todosList = document.querySelector(".todos-list");
const filterButtons = document.querySelectorAll(".ctr-div span");
const clearButton = document.querySelector(".clear-btn");

let todos = JSON.parse(localStorage.getItem("todos-list")) || [];

// Render tasks based on the selected filter
function renderTodos(filter = "all") {
  todosList.innerHTML = ""; // Clear the list
  todos.forEach((todo, index) => {
    if (filter === "completed" && todo.status !== "completed") return;
    if (filter === "pending" && todo.status !== "pending") return;

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

      // Re-enable all checkboxes and delete icons
      todosList
        .querySelectorAll("input[type='checkbox']")
        .forEach((checkbox) => {
          checkbox.disabled = false;
        });
      todosList.querySelectorAll(".delete-ic").forEach((icon) => {
        icon.style.pointerEvents = "auto";
        icon.style.opacity = "1";
      });
      // Reset input opacity
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

    // Disable all checkboxes and delete icons
    todosList.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      checkbox.disabled = true;
    });
    todosList.querySelectorAll(".delete-ic").forEach((icon) => {
      icon.style.pointerEvents = "none";
      icon.style.opacity = "0.5";
    });
    // Reduce input opacity
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
