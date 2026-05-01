import { html } from "./helpers.js";
import { format } from "date-fns";

export class TodoView {
  constructor(root, todo, projects) {
    this.root = root;
    this.todo = todo;
    this.projects = projects;
  }

  render() {
    this.root.dataset.todoId = this.todo.id;
    this.root.innerHTML = html`
      <div class="todo-view">
        <main>
          <section class="todo-title-wrapper">
            <input
              type="checkbox"
              id="todo-status"
              ${this.todo.isDone ? "checked" : ""}
            />
            <input
              type="text"
              placeholder="New To-Do"
              value="${this.todo.title}"
              id="todo-title"
              required
            />
          </section>
          <section class="todo-details-wrapper">
            <textarea
              name="todo-notes"
              id="todo-notes"
              placeholder="Todo notes"
            >
${this.todo.notes}</textarea
            >
            <div class="todo-due-date">
              <input
                type="date"
                id="todo-due-date"
                value="${this.todo.dueDate === null
                  ? ""
                  : format(this.todo.dueDate, "yyyy-MM-dd")}"
              />
            </div>
            <div class="todo-priority">
              <div class="radio-item">
                <input
                  type="radio"
                  id="priority-noarmal"
                  name="priority"
                  value="0"
                  ${this.todo.priority === 0 ? "checked" : ""}
                />
                <label for="priority-noarmal">Normal</label>
              </div>

              <div class="radio-item">
                <input
                  type="radio"
                  id="priority-important"
                  name="priority"
                  value="1"
                  ${this.todo.priority === 1 ? "checked" : ""}
                />
                <label for="priority-important">Important</label>
              </div>
              <div class="radio-item">
                <input
                  type="radio"
                  id="priority-urgent"
                  name="priority"
                  value="2"
                  ${this.todo.priority === 2 ? "checked" : ""}
                />
                <label for="priority-urgent">Urgent</label>
              </div>
            </div>
          </section>
        </main>
        <footer>
          <section class="todo-project-wrapper">
            <input
              type="text"
              placeholder="Project"
              value="${this.todo.project}"
              id="todo-project"
              list="projects-list"
              required
            />
            <datalist id="projects-list">
              <option value="Inbox">Inbox</option>
              ${this.projects.map(
                (project) => `<option value="${project}">${project}</option>`
              )}
            </datalist>
          </section>
          <section class="todo-controls-wrapper">
            <button class="btn-cancel">Cancel</button>
            <button class="btn-save">Save</button>
            <button class="btn-delete">Delete</button>
          </section>
        </footer>
      </div>
    `;

    this.#handleCloseModal();
  }

  #handleCloseModal() {
    this.root.addEventListener("click", (e) => {
      if (e.target.classList[0] === "btn-cancel") {
        this.root.close();
      }
    });
  }
  // Used for both adding and updating todos
  bindSaveTodo(handleClick) {
    const el = this.root.querySelector(".todo-view");
    el.addEventListener("click", (e) => {
      if (e.target.classList[0] === "btn-save") {
        e.preventDefault();
        const $ = (selector) => this.root.querySelector(selector);
        const details = {
          title: $("#todo-title").value,
          notes: $("#todo-notes").value,
          dueDate: $("#todo-due-date").valueAsNumber || null,
          priority: Number($('input[name="priority"]:checked').value),
          project: $("#todo-project").value || "Inbox",
          isDone: $("#todo-status").checked,
        };
        handleClick(details);
      }
    });
  }

  bindDeleteTodo(handleClick) {
    const el = this.root.querySelector(".todo-view");
    el.addEventListener("click", (e) => {
      if (e.target.classList[0] === "btn-delete") {
        e.preventDefault();
        handleClick();
      }
    });
  }
}
