import { html } from "./helpers.js";

class SidebarView {
  constructor(root, projects) {
    this.root = root;
    this.projects = projects;
  }

  render() {
    this.root.innerHTML = html`
      <section>
        <button data-project-name="Inbox" class="selected">Inbox</button>
      </section>

      <section class="time-frames">
        <button data-time-frame="today">Today</button>
        <button data-time-frame="upcomming">Upcomming</button>
        <button data-time-frame="anytime">Anytime</button>
      </section>

      <section class="projects">
        ${this.#getPorjectsListHtml(this.projects)}
      </section>
    `;
    this.#highlightSelectedItem();
  }

  #getPorjectsListHtml(projects) {
    return projects
      .map(
        (project) =>
          `<button data-project-name="${project}">${project}</button>`
      )
      .join("");
  }

  #highlightSelectedItem() {
    let currentSelectedItem = "Inbox";
    this.root.addEventListener("click", (e) => {
      if (e.target.localName === "button") {
        currentSelectedItem = e.target.textContent;
      }

      const buttons = this.root.querySelectorAll("button");
      for (const btn of buttons) {
        if (btn.textContent === currentSelectedItem) {
          btn.classList.add("selected");
        } else {
          btn.classList.remove("selected");
        }
      }
    });
  }

  bindShowProject(handleClick) {
    this.root.addEventListener("click", (e) => {
      if (e.target.dataset.projectName) {
        handleClick(e.target.dataset.projectName);
      }
    });
  }

  bindShowDate(handleClick) {
    this.root.addEventListener("click", (e) => {
      if (e.target.dataset.timeFrame) {
        handleClick(e.target.dataset.timeFrame);
      }
    });
  }
}

class ContentView {
  constructor(root, viewName, todos) {
    this.root = root;
    this.viewName = viewName;
    this.todos = todos;
  }

  render() {
    this.root.innerHTML = html`
      <h1>${this.viewName}</h1>
      <ul>
        ${this.todos
          .map(
            (todo) =>
              `<li data-todo-id="${todo.id}">${this.#getTodoItemHtml(todo)}</li>`
          )
          .join("")}
      </ul>
    `;
  }

  #getTodoItemHtml(todo) {
    return html`
      <input type="checkbox" ${todo.isDone ? "checked" : ""} />
      <div>
        <span>${todo.title}</span>
        <span>${todo.dueDate}</span>
        <span>${todo.priority}</span>
      </div>
    `;
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
}

class TodoView {
  constructor(root, todo) {
    this.todo = todo;
    this.root = root;
  }

  #getDateFromEpoch(epoch) {
    const date = new Date(epoch);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
  }

  render() {
    this.root.dataset.todoId = this.todo.id;
    this.root.innerHTML = html`
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
          />
        </section>
        <section class="todo-details-wrapper">
          <textarea name="todo-notes" id="todo-notes" placeholder="Todo notes">
${this.todo.notes}</textarea
          >
          <div class="todo-due-date">
            <input
              type="date"
              id="todo-due-date"
              value=${this.#getDateFromEpoch(this.todo.dueDate)}
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
          />
        </section>
        <section class="todo-controls-wrapper">
          <button class="btn-cancel">Cancel</button>
          <button class="btn-save">Save</button>
          <button class="btn-delete">Delete</button>
        </section>
      </footer>
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
  bindSaveTodo(handleclick) {
    this.dom.addEventListener("click", (e) => {
      if (e.target.classList[0] === "btn-save") {
        e.preventDefault();
        const $ = (selector) => this.dom.querySelector(selector);
        const details = {
          title: $("#todo-title").value,
          notes: $("#todo-notes").value,
          dueDate: $("#todo-due-date").valueAsNumber,
          priority: Number($('input[name="priority"]:checked').value),
          isDone: $("#todo-status").checked,
        };
        handleclick(details);
      }
    });
  }

  bindDeleteTodo(handleclick) {
    this.dom.addEventListener("click", (e) => {
      if (e.target.classList[0] === "btn-delete") {
        e.preventDefault();
        handleclick(this.dom.dataset.todoId);
      }
    });
  }
}

export { SidebarView, ContentView, TodoView };
