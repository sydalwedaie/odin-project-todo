import { html } from "./helpers.js";

export class SidebarView {
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

  bindShowTimeFrame(handleClick) {
    this.root.addEventListener("click", (e) => {
      if (e.target.dataset.timeFrame) {
        handleClick(e.target.dataset.timeFrame);
      }
    });
  }
}
