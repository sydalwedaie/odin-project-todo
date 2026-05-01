import "./assets/modern-normalize.css";
import "./assets/reset.css";
import "./index.css";
import "./template.html";
import sampleData from "./sample_data.js";
import { getTime, startOfToday } from "date-fns";
import { capitalize } from "./helpers.js";
import { Collection } from "./model.js";
import { SidebarView } from "./view_sidebar.js";
import { ContentView } from "./view_content.js";
import { TodoView } from "./view_todo.js";
import { EditProject } from "./view_aux.js";

const collection = new Collection();
collection.init(sampleData);
window.collection = collection;

const sidebarEl = document.querySelector("#sidebar");
const contentEl = document.querySelector("#content");
const dialogEl = document.querySelector("dialog");

const UIstate = {
  currentViewType: "inbox",
  currentViewTitle: "Inbox",
};

function renderSidebarView(projects, todayCounter, UIstate) {
  const view = new SidebarView(sidebarEl, projects, todayCounter);
  view.render();

  view.bindHighlightSelectedItem(UIstate.currentViewTitle);

  view.bindShowInbox(() => {
    renderContentView("inbox", "Inbox", collection.getTodosFromInbox());
    UIstate.currentViewType = "inbox";
    UIstate.currentViewTitle = "Inbox";
  });

  view.bindShowTimeFrame((timeFrame) => {
    renderContentView(
      "timeFrame",
      capitalize(timeFrame),
      collection.getTodosByTimeFrame(timeFrame)
    );
    UIstate.currentViewType = "timeFrame";
    UIstate.currentViewTitle = timeFrame;
  });

  view.bindShowProject((projectName) => {
    renderContentView(
      "project",
      projectName,
      collection.getTodosByProject(projectName)
    );
    UIstate.currentViewType = "project";
    UIstate.currentViewTitle = projectName;
  });
}

function renderContentView(type, title, todos) {
  const view = new ContentView(contentEl, type, title, todos);

  view.render();
  view.bindToggleTodoStatus((id) => {
    collection.toggleTodoStatus(id);
    updateView(collection);
  });

  view.bindShowTodoDetails((id) => {
    renderTodoView(id, UIstate);
  });

  view.bindShowAddnewTodo(() => {
    renderTodoView(null, UIstate);
  });

  if (type === "project") {
    view.bindShowEditProject((projectName) => {
      renderEditProjectView(projectName);
    });
  }
}

function renderTodoView(id, UIstate) {
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
    UIstate.currentViewType === "inbox" ||
    UIstate.currentViewType === "timeFrame"
  ) {
    todoTemplate.project = "Inbox";
  }

  if (UIstate.currentViewTitle === "today") {
    todoTemplate.dueDate = getTime(startOfToday());
  }

  if (UIstate.currentViewType === "project") {
    todoTemplate.project = UIstate.currentViewTitle;
  }

  const view = new TodoView(
    dialogEl,
    id ? collection.getTodo(id) : todoTemplate,
    collection.projects
  );

  dialogEl.showModal();
  view.render();
  view.bindSaveTodo((details) => {
    // This setup allows using one button for both events
    if (id) {
      collection.editTodo(id, details);
    } else {
      collection.addTodo(details);
      // Uncomment to jumpt to newly created project
      // UIstate.currentViewType = "project";
      // UIstate.currentViewTitle = details.project;
    }
    dialogEl.close();
    updateView(collection);
  });

  // Attach only if view is opened to edit
  if (id) {
    view.bindDeleteTodo(() => {
      collection.deleteTodo(id);
      dialogEl.close();
      updateView(collection);
    });
  }
}

function renderEditProjectView(projectName) {
  const view = new EditProject(dialogEl, projectName);
  dialogEl.showModal();
  view.render();
  view.bindSaveProject((newName) => {
    collection.editProject(projectName, newName);
    UIstate.currentViewTitle = newName;
    dialogEl.close();
    updateView(collection);
  });
  view.bindDeleteProject(() => {
    collection.deleteProject(projectName);
    UIstate.currentViewType = "inbox";
    UIstate.currentViewTitle = "Inbox";
    dialogEl.close();
    updateView(collection);
  });
}

function updateView(collection) {
  renderSidebarView(collection.projects, collection.getTodayCount(), UIstate);
  switch (UIstate.currentViewType) {
    case "inbox":
      renderContentView(
        "inbox",
        UIstate.currentViewTitle,
        collection.getTodosFromInbox()
      );
      break;
    case "timeFrame":
      renderContentView(
        "timeFrame",
        UIstate.currentViewTitle,
        collection.getTodosByTimeFrame(UIstate.currentViewTitle)
      );
      break;
    case "project":
      renderContentView(
        "project",
        UIstate.currentViewTitle,
        collection.getTodosByProject(UIstate.currentViewTitle)
      );
      break;
  }
}

// Initialize app
renderSidebarView(collection.projects, collection.getTodayCount(), UIstate);
renderContentView("inbox", "Inbox", collection.getTodosByProject("Inbox"));
