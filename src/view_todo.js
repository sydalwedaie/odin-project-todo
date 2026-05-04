import { html } from "./helpers.js";
import { format, isPast, isToday, isFuture } from "date-fns";

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
          <section class="status-wrapper">
            <input
              type="checkbox"
              id="todo-status"
              ${this.todo.isDone ? "checked" : ""}
            />
          </section>
          <section class="details-wrapper">
            <input
              type="text"
              placeholder="${this.todo.id ? "Rename To-Do" : "New To-Do"}"
              value="${this.todo.title}"
              id="todo-title"
              required
            />
            <textarea
              class="textarea"
              name="todo-notes"
              id="todo-notes"
              placeholder="Notes"
              rows="3"
            >
${this.todo.notes || ""}</textarea
            >
            <div class="todo-due-date">
              <label
                class="todo-due-date-display due-date-control"
                for="todo-due-date"
                >When?</label
              >
              <input
                onfocus="this.showPicker()"
                type="date"
                id="todo-due-date"
                value="${this.todo.dueDate === null
                  ? ""
                  : format(this.todo.dueDate, "yyyy-MM-dd")}"
              />
            </div>
            <div class="todo-priority">
              <input
                type="radio"
                id="priority-noarmal"
                name="priority"
                value="0"
                ${this.todo.priority === 0 ? "checked" : ""}
              />
              <label for="priority-noarmal">Normal</label>

              <input
                type="radio"
                id="priority-important"
                name="priority"
                value="1"
                ${this.todo.priority === 1 ? "checked" : ""}
              />
              <label for="priority-important">Important</label>

              <input
                type="radio"
                id="priority-urgent"
                name="priority"
                value="2"
                ${this.todo.priority === 2 ? "checked" : ""}
              />
              <label for="priority-urgent">Urgent</label>
            </div>
          </section>
        </main>
        <footer>
          <section class="project-wrapper">
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
          <section class="controls-wrapper">
            <button class="btn-cancel">Cancel</button>
            <button class="btn-save">Save</button>
            ${this.todo.id ? '<button class="btn-delete">Delete</button>' : ""}
          </section>
        </footer>
      </div>
    `;

    this.#handleCloseModal();
    this.#renderDueDate();
  }

  #formatDueDate(timeStamp) {
    let icon = '<span class="icon material-icons">view_timeline</span>';
    if (isToday(timeStamp)) {
      icon = '<span class="icon material-icons-round">star</span>';
    } else if (isFuture(timeStamp)) {
      icon = '<span class="icon material-icons">calendar_month</span>';
    } else if (timeStamp && isPast(timeStamp)) {
      console.log("is past?");
      icon = '<span class="icon material-icons">circle_notifications</span>';
    }

    return icon + (timeStamp ? format(timeStamp, "PP") : "Anytime");
  }

  #renderDueDate() {
    const displayEl = this.root.querySelector(".todo-due-date-display");
    displayEl.innerHTML = this.#formatDueDate(this.todo.dueDate);
    this.root
      .querySelector("#todo-due-date")
      .addEventListener("change", (e) => {
        displayEl.innerHTML = this.#formatDueDate(e.target.valueAsNumber);
      });
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
