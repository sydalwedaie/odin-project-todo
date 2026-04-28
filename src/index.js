import "./assets/modern-normalize.css";
import "./assets/reset.css";
import "./index.css";
import "./template.html";
import sampleData from "./sample_data.js";
import { isToday, isFuture } from "date-fns";
import { Collection } from "./model.js";
import { SidebarView, ContentView, TodoView } from "./view.js";

const collection = new Collection();
collection.init(sampleData);
window.collection = collection;

const sidebarEl = document.querySelector(".sidebar");
const contentEl = document.querySelector("#content");
const dialogEl = document.querySelector("dialog");

const sidebarView = new SidebarView(sidebarEl, collection.projects);
sidebarView.render();
sidebarView.bindShowProject((projectName) => {
  handleContentView(projectName, collection.getTodosByProject(projectName));
});

sidebarView.bindShowDate((timeFrame) => {
  let predicate;
  switch (timeFrame) {
    case "today":
      predicate = isToday;
      break;
    case "upcomming":
      predicate = isFuture;
      break;
    case "anytime":
      predicate = (val) => val === null;
  }

  handleContentView(timeFrame, collection.getTodosByDate(predicate));
});

function handleContentView(title, todos) {
  const contentView = new ContentView(contentEl, title, todos);
  contentView.render();
  contentView.bindShowTodoDetails((todoId) => {
    const todoView = new TodoView(dialogEl, collection.getTodo(todoId));
    dialogEl.showModal();
    todoView.render();
  });
}

// Initialize app with Inbox displayed
handleContentView("Inbox", collection.getTodosByProject("Inbox"));
