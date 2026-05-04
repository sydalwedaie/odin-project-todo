import sampleData from "./sample_data.js";
import { getTime, startOfToday } from "date-fns";
import { capitalize } from "./helpers.js";
import { Collection } from "./model.js";
import { SidebarView } from "./view_sidebar.js";
import { ContentView } from "./view_content.js";
import { TodoView } from "./view_todo.js";
import { EditProject } from "./view_aux.js";

export class Controller {
  #sidebarControlEl = document.querySelector(".sidebar-control");
  #mainEl = document.querySelector(".main");
  #sidebarEl = document.querySelector("#sidebar");
  #contentEl = document.querySelector("#content");
  #dialogEl = document.querySelector("dialog");

  #collection = new Collection();
  #UIstate = {
    currentViewType: "inbox",
    currentViewTitle: "Inbox",
  };

  init() {
    this.#collection.init(sampleData);
    window.collection = this.#collection;
    this.renderSidebarView(
      this.#sidebarEl,
      this.#collection.projects,
      this.#collection.getTodayCount()
    );
    this.renderContentView(
      this.#contentEl,
      "inbox",
      "Inbox",
      this.#collection.getTodosByProject("Inbox")
    );

    this.#sidebarControlEl.addEventListener("click", () => {
      this.#mainEl.classList.toggle("sidebar-open");
    });

    window.addEventListener("resize", (e) => {
      console.log(e);
    });
  }

  renderSidebarView(root, projects, todayCounter) {
    const view = new SidebarView(root, projects, todayCounter);

    view.render();
    view.bindHighlightSelectedItem(this.#UIstate.currentViewTitle);
    view.bindShowInbox(() => {
      this.renderContentView(
        this.#contentEl,
        "inbox",
        "Inbox",
        this.#collection.getTodosFromInbox()
      );
      this.#UIstate.currentViewType = "inbox";
      this.#UIstate.currentViewTitle = "Inbox";
    });

    view.bindShowTimeFrame((timeFrame) => {
      this.renderContentView(
        this.#contentEl,
        "timeFrame",
        capitalize(timeFrame),
        this.#collection.getTodosByTimeFrame(timeFrame)
      );
      this.#UIstate.currentViewType = "timeFrame";
      this.#UIstate.currentViewTitle = timeFrame;
    });

    view.bindShowProject((projectName) => {
      this.renderContentView(
        this.#contentEl,
        "project",
        projectName,
        this.#collection.getTodosByProject(projectName)
      );
      this.#UIstate.currentViewType = "project";
      this.#UIstate.currentViewTitle = projectName;
    });
  }

  renderContentView(root, type, title, todos) {
    const view = new ContentView(root, type, title, todos);

    view.render();
    view.bindToggleTodoStatus((id) => {
      this.#collection.toggleTodoStatus(id);
      this.updateView();
    });

    view.bindShowTodoDetails((id) => {
      this.renderTodoView(this.#dialogEl, id);
    });

    view.bindShowAddnewTodo(() => {
      this.renderTodoView(this.#dialogEl, null);
    });

    if (type === "project") {
      view.bindShowEditProject((projectName) => {
        this.renderEditProjectView(this.#dialogEl, projectName);
      });
    }
  }

  renderTodoView(root, id) {
    // Rendered view depends on which view it is opened from:
    // if valid id, it's a 'show todo' scenario; populate view with an existing todo
    // if no valid id, it's a 'add todo' scenario; populate based on view type and title

    const todoTemplate = {
      title: "",
      notes: "",
      dueDate: null,
      priority: 0,
      project: "",
      isDone: false,
    };

    if (
      this.#UIstate.currentViewType === "inbox" ||
      this.#UIstate.currentViewType === "timeFrame"
    ) {
      todoTemplate.project = "Inbox";
    }

    if (this.#UIstate.currentViewTitle === "today") {
      todoTemplate.dueDate = getTime(startOfToday());
    }

    if (this.#UIstate.currentViewType === "project") {
      todoTemplate.project = this.#UIstate.currentViewTitle;
    }

    const view = new TodoView(
      root,
      id ? this.#collection.getTodo(id) : todoTemplate,
      this.#collection.projects
    );

    root.showModal();
    view.render();
    view.bindSaveTodo((details) => {
      // This setup allows using one button for both events
      if (id) {
        this.#collection.editTodo(id, details);
      } else {
        this.#collection.addTodo(details);
        // Uncomment to jumpt to newly created project
        // UIstate.currentViewType = "project";
        // UIstate.currentViewTitle = details.project;
      }
      root.close();
      this.updateView();
    });

    // Attach only if view is opened to edit
    if (id) {
      view.bindDeleteTodo(() => {
        this.#collection.deleteTodo(id);
        // When last todo is deleted, remove the project view
        if (
          this.#UIstate.currentViewType === "project" &&
          this.#collection.getTodosByProject(this.#UIstate.currentViewTitle)
            .length === 0
        ) {
          this.#UIstate.currentViewType = "inbox";
          this.#UIstate.currentViewTitle = "Inbox";
        }
        root.close();
        this.updateView();
      });
    }
  }

  renderEditProjectView(root, projectName) {
    const view = new EditProject(root, projectName);
    root.showModal();
    view.render();
    view.bindSaveProject((newName) => {
      this.#UIstate.currentViewTitle = newName;
      this.#collection.editProject(projectName, newName);
      root.close();
      this.updateView();
    });
    view.bindDeleteProject(() => {
      this.#UIstate.currentViewType = "inbox";
      this.#UIstate.currentViewTitle = "Inbox";
      this.#collection.deleteProject(projectName);
      root.close();
      this.updateView();
    });
  }

  updateView() {
    this.renderSidebarView(
      this.#sidebarEl,
      this.#collection.projects,
      this.#collection.getTodayCount()
    );
    switch (this.#UIstate.currentViewType) {
      case "inbox":
        this.renderContentView(
          this.#contentEl,
          "inbox",
          this.#UIstate.currentViewTitle,
          this.#collection.getTodosFromInbox()
        );
        break;
      case "timeFrame":
        this.renderContentView(
          this.#contentEl,
          "timeFrame",
          capitalize(this.#UIstate.currentViewTitle),
          this.#collection.getTodosByTimeFrame(this.#UIstate.currentViewTitle)
        );
        break;
      case "project":
        this.renderContentView(
          this.#contentEl,
          "project",
          this.#UIstate.currentViewTitle,
          this.#collection.getTodosByProject(this.#UIstate.currentViewTitle)
        );
        break;
    }
  }
}

// Initialize app
