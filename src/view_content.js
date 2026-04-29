import { html } from "./helpers.js";
import { format } from "date-fns";

export class ContentView {
  constructor(root, viewName, todos) {
    this.root = root;
    this.viewName = viewName;
    this.todos = todos;
  }

  render() {
    this.root.innerHTML = html`
      <div class="content-view">
        <h1>${this.viewName}</h1>
        <ul>
          ${this.todos
            .map(
              (todo) =>
                `<li data-todo-id="${todo.id}">${this.#getTodoItemHtml(todo)}</li>`
            )
            .join("")}
        </ul>
        <button class="show-add-new-todo">Add new todo</button>
      </div>
    `;
  }

  #getTodoItemHtml(todo) {
    return html`
      <input
        type="checkbox"
        class="todo-status"
        ${todo.isDone ? "checked" : ""}
      />
      <div>
        <span>${todo.title}</span>
        <span
          >${todo.dueDate === null
            ? ""
            : format(todo.dueDate, "yyyy-MM-dd")}</span
        >
        <span>${todo.priority}</span>
      </div>
    `;
  }

  bindToggleTodoStatus(handleClick) {
    const el = this.root.querySelector("ul");
    el.addEventListener("click", (e) => {
      if (e.target.classList[0] === "todo-status") {
        handleClick(e.target.closest("[data-todo-id]").dataset.todoId);
      }
    });
  }

  bindShowTodoDetails(handleClick) {
    // Select an element that gets distroyed every time a new view is rendered
    // otherwise this event listener keeps piling up.
    const el = this.root.querySelector("ul");
    el.addEventListener("click", (e) => {
      // `closest` helps find the nerest target matching the selector
      const listItem = e.target.closest("[data-todo-id]");

      // Trigger anywhwere in a list item, except on the checkbox
      if (listItem && !e.target.closest("input")) {
        handleClick(listItem.dataset.todoId);
      }
    });
  }

  bindShowAddnewTodo(handleClick) {
    const el = this.root.querySelector(".content-view");
    el.addEventListener("click", (e) => {
      if (e.target.classList[0] === "show-add-new-todo") {
        handleClick();
      }
    });
  }
}
