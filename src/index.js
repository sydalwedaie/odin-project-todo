import "./assets/modern-normalize.css";
import "./assets/reset.css";
import "./index.css";
import "./template.html";
import sampleData from "./sample_data.js";
import { isToday, isFuture, format, getTime, startOfToday } from "date-fns";
import { Collection } from "./model.js";
import { SidebarView } from "./view_sidebar.js";
import { ContentView } from "./view_content.js";
import { TodoView } from "./view_todo.js";
import { EditProject } from "./aux.js";

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

function renderSidebarView(projects) {
  const sidebarView = new SidebarView(sidebarEl, projects);
  sidebarView.render();

  sidebarView.bindHighlightSelectedItem(UIstate.currentViewTitle);

  sidebarView.bindShowInbox(() => {
    renderContentView("inbox", "Inbox", collection.getTodosFromInbox());
    UIstate.currentViewType = "inbox";
    UIstate.currentViewTitle = "Inbox";
  });

  sidebarView.bindShowTimeFrame((timeFrame) => {
    renderContentView(
      "timeFrame",
      timeFrame,
      collection.getTodosByTimeFrame(timeFrame)
    );
    UIstate.currentViewType = "timeFrame";
    UIstate.currentViewTitle = timeFrame;
  });

  sidebarView.bindShowProject((projectName) => {
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
  const contentView = new ContentView(contentEl, type, title, todos);

  contentView.render();
  contentView.bindToggleTodoStatus((id) => {
    collection.toggleTodoStatus(id);
  });

  contentView.bindShowTodoDetails((id) => {
    renderTodoView(id, UIstate);
  });

  contentView.bindShowAddnewTodo(() => {
    renderTodoView(null, UIstate);
  });

  if (type === "project") {
    contentView.bindShowEditProject((projectName) => {
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

  const todoView = new TodoView(
    dialogEl,
    id ? collection.getTodo(id) : todoTemplate,
    collection.projects
  );

  dialogEl.showModal();
  todoView.render();
  todoView.bindSaveTodo((details) => {
    // This setup allows using one button for both events
    if (id) {
      collection.editTodo(id, details);
    } else {
      collection.addTodo(details);
    }
    dialogEl.close();
    updateView(collection);
  });

  // Attach only if view is opened to add.
  if (id) {
    todoView.bindDeleteTodo(() => {
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
    dialogEl.close();
    UIstate.currentViewTitle = newName;
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
  renderSidebarView(collection.projects);
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
renderSidebarView(collection.projects);
renderContentView("inbox", "Inbox", collection.getTodosByProject("Inbox"));
