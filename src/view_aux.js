import { html } from "./helpers.js";

export class EditProject {
  constructor(root, projectName) {
    this.root = root;
    this.projectName = projectName;
  }

  render() {
    console.log("haa");
    this.root.innerHTML = html`
      <div class="edit-project-view">
        <input type="text" id="project-name" value="${this.projectName}" />
        <button class="btn-save">Save</button>
        <button class="btn-delete">Delete</button>
      </div>
    `;
  }

  bindSaveProject(handleClick) {
    const el = this.root.querySelector(".edit-project-view");
    el.addEventListener("click", (e) => {
      if (e.target.classList[0] === "btn-save") {
        const inputValue = this.root.querySelector("#project-name").value;
        handleClick(inputValue);
      }
    });
  }

  bindDeleteProject(handleClick) {
    const el = this.root.querySelector(".edit-project-view");
    el.addEventListener("click", (e) => {
      if (e.target.classList[0] === "btn-delete") {
        handleClick();
      }
    });
  }
}
