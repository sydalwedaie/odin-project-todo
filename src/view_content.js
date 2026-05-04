import { html } from "./helpers.js";
import { format } from "date-fns";

// This class is used to display 3 views: Inbox, time frames, and project
// Some views have conditionally rendered elements
export class ContentView {
  constructor(root, type, title, todos) {
    this.root = root;
    this.type = type;
    this.title = title;
    this.todos = todos;
  }

  render() {
    this.root.innerHTML = html`
      <div class="content-view">
        <header class="content-header">
          <h1>${this.title}</h1>
          ${this.type === "project"
            ? "<button class='show-edit-project'><span class='material-icons'>edit</span></button>"
            : ""}
        </header>
        <ul class="todo-list">
          ${this.todos
            .map(
              (todo) =>
                `<li data-todo-id="${todo.id}">${this.#getTodoItemHtml(todo)}</li>`
            )
            .join("")}
        </ul>
        <footer>
          <button class="show-add-new-todo">
            <span class="material-icons">add</span>
            <span>Add new To-Do</span>
          </button>
        </footer>
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
      <div class="todo-details">
        <div class="todo-details-primary">
          <span class="todo-title">${todo.title}</span>
          ${todo.notes
            ? '<span class="todo-notes-indicator material-icons-outlined">note</span>'
            : ""}
          <span class="todo-due-date"
            >${todo.dueDate === null ? "" : format(todo.dueDate, "PP")}</span
          >
          <span class="${`todo-priority priority-${todo.priority}`}">
            <span class="material-icons">flag</span>
          </span>
        </div>
        <div class="todo-details-secondary">
          ${this.type === "timeFrame"
            ? `<div class="todo-project">${todo.project}</div>`
            : ""}
        </div>
      </div>
    `;
  }

  bindShowEditProject(handleClick) {
    const el = this.root.querySelector(".content-view");
    el.addEventListener("click", (e) => {
      if (e.target.closest(".show-edit-project")) {
        // pass project's name
        handleClick(this.title);
      }
    });
  }

  bindToggleTodoStatus(handleClick) {
    const el = this.root.querySelector(".content-view");
    el.addEventListener("click", (e) => {
      if (e.target.classList[0] === "todo-status") {
        handleClick(e.target.closest("[data-todo-id]").dataset.todoId);
      }
    });
  }

  bindShowTodoDetails(handleClick) {
    // Select an element that gets distroyed every time a new view is rendered
    // otherwise this event listener keeps piling up.
    const el = this.root.querySelector(".content-view");
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
      if (e.target.closest(".show-add-new-todo")) {
        handleClick();
      }
    });
  }
}
