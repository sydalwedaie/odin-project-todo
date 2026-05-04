import { html } from "./helpers.js";

export class SidebarView {
  constructor(root, projects, todayCounter) {
    this.root = root;
    this.projects = projects;
    this.todayCounter = todayCounter;
  }

  render() {
    this.root.innerHTML = html`
      <section class="inbox">
        <button data-view-title="Inbox" data-inbox="true" class="selected">
          <span class="icon material-icons">inbox</span>
          <span>Inbox</span>
        </button>
      </section>

      <section class="time-frames">
        <button data-view-title="today" data-time-frame="today">
          <span class="icon icon-today material-icons-round">star</span>
          <span>Today</span>

          ${this.todayCounter
            ? `<span class="today-counter">${this.todayCounter}</span>`
            : ""}
        </button>
        <button data-view-title="upcomming" data-time-frame="upcomming">
          <span class="icon icon-upcomming material-icons">calendar_month</span>
          <span>Upcomming</span>
        </button>
        <button data-view-title="anytime" data-time-frame="anytime">
          <span class="icon icon-anytime material-icons">view_timeline</span>
          <span>Anytime</span>
        </button>
      </section>

      <section class="projects">
        ${this.#getPorjectsListHtml(this.projects)}
      </section>
      <footer>
        <div class="attribution">
          <p>
            Project by
            <a
              href="https://www.theodinproject.com/lessons/node-path-javascript-todo-list"
              >The Odin Project</a
            >. Design inspired from
            <a
              href="https://www.frontendmentor.io/challenges/dine-restaurant-website-yAt7Vvxt7"
              >Things</a
            >
            app.
          </p>
          <p>
            Coded by
            <a href="https://github.com/sydalwedaie/odin-project-todo"
              >Sayed Ali Alwedaie</a
            >
          </p>
        </div>
      </footer>
    `;
  }

  #getPorjectsListHtml(projects) {
    return projects
      .map(
        (project) =>
          html`<button
            data-view-title="${project}"
            data-project-name="${project}"
          >
            <span class="icon material-icons-outlined">circle</span>
            <span>${project}</span>
          </button>`
      )
      .join("");
  }

  bindHighlightSelectedItem(item) {
    let currentSelectedItem = item;
    const update = () => {
      const buttons = this.root.querySelectorAll("button");
      for (const btn of buttons) {
        if (btn.dataset.viewTitle === currentSelectedItem) {
          btn.classList.add("selected");
        } else {
          btn.classList.remove("selected");
        }
      }
    };

    update();

    this.root.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) {
        currentSelectedItem = btn.dataset.viewTitle;
      }
      update();
    });
  }

  bindShowInbox(handleClick) {
    this.root.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn && btn.dataset.inbox) {
        handleClick();
      }
    });
  }

  bindShowTimeFrame(handleClick) {
    this.root.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn && btn.dataset.timeFrame) {
        handleClick(btn.dataset.timeFrame);
      }
    });
  }

  bindShowProject(handleClick) {
    this.root.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn && btn.dataset.projectName) {
        handleClick(btn.dataset.projectName);
      }
    });
  }
}
