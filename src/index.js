import "./assets/modern-normalize.css";
import "./assets/reset.css";
import "./index.css";
import "./template.html";
import sampleData from "./sample_data.js";
import { isToday, isFuture, format } from "date-fns";
import { Collection } from "./model.js";
import { SidebarView } from "./view_sidebar.js";
import { ContentView } from "./view_content.js";
import { TodoView } from "./view_todo.js";

const collection = new Collection();
collection.init(sampleData);
window.collection = collection;

const sidebarEl = document.querySelector("#sidebar");
const contentEl = document.querySelector("#content");
const dialogEl = document.querySelector("dialog");

const UIstate = {
  currentViewType: "project",
  currentViewTitle: "Inbox",
};

function renderSidebarView(projects) {
  const sidebarView = new SidebarView(sidebarEl, projects);
  sidebarView.render();
  sidebarView.bindShowProject((projectName) => {
    renderContentView(projectName, collection.getTodosByProject(projectName));
    UIstate.currentViewType = "project";
    UIstate.currentViewTitle = projectName;
  });

  sidebarView.bindShowTimeFrame((timeFrame) => {
    renderContentView(timeFrame, collection.getTodosByTimeFrame(timeFrame));
    UIstate.currentViewType = "timeFrame";
    UIstate.currentViewTitle = timeFrame;
  });
}

function renderContentView(title, todos) {
  const contentView = new ContentView(contentEl, title, todos);

  contentView.render();
  contentView.bindToggleTodoStatus((id) => {
    collection.toggleTodoStatus(id);
  });

  contentView.bindShowTodoDetails((id) => {
    renderTodoView(id);
  });

  contentView.bindShowAddnewTodo(() => {
    renderTodoView(null);
  });
}

function renderTodoView(id) {
  // Recieves projects for list autocomplete
  const todoView = new TodoView(
    dialogEl,
    collection.getTodo(id),
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

  todoView.bindDeleteTodo(() => {
    collection.deleteTodo(id);
    dialogEl.close();
    updateView(collection);
  });
}

function updateView(collection) {
  renderSidebarView(collection.projects);
  switch (UIstate.currentViewType) {
    case "project":
      renderContentView(
        UIstate.currentViewTitle,
        collection.getTodosByProject(UIstate.currentViewTitle)
      );
      break;
    case "timeFrame":
      renderContentView(
        UIstate.currentViewTitle,
        collection.getTodosByTimeFrame(UIstate.currentViewTitle)
      );
      break;
  }
}

// Initialize app
renderSidebarView(collection.projects);
renderContentView("Inbox", collection.getTodosByProject("Inbox"));
