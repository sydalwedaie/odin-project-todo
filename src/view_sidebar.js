import { html } from "./helpers.js";

export class SidebarView {
  constructor(root, projects, todayCounter) {
    this.root = root;
    this.projects = projects;
    this.todayCounter = todayCounter;
  }

  render() {
    this.root.innerHTML = html`
      <section>
        <button data-view-title="Inbox" data-inbox="true" class="selected">
          Inbox
        </button>
      </section>

      <section class="time-frames">
        <button data-view-title="today" data-time-frame="today">
          Today <span class="today-counter">${this.todayCounter}</span>
        </button>
        <button data-view-title="upcomming" data-time-frame="upcomming">
          Upcomming
        </button>
        <button data-view-title="anytime" data-time-frame="anytime">
          Anytime
        </button>
      </section>

      <section class="projects">
        ${this.#getPorjectsListHtml(this.projects)}
      </section>
    `;
  }

  #getPorjectsListHtml(projects) {
    return projects
      .map(
        (project) =>
          `<button data-view-title="${project}" data-project-name="${project}">${project}</button>`
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
      if (e.target.localName === "button") {
        currentSelectedItem = e.target.dataset.viewTitle;
      }
      update();
    });
  }

  bindShowInbox(handleClick) {
    this.root.addEventListener("click", (e) => {
      if (e.target.dataset.inbox) {
        handleClick();
      }
    });
  }

  bindShowTimeFrame(handleClick) {
    this.root.addEventListener("click", (e) => {
      if (e.target.dataset.timeFrame) {
        handleClick(e.target.dataset.timeFrame);
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
}
