import { isToday, isFuture } from "date-fns";

class Collection {
  #todos = [];

  // Todo tasks
  getTodo(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  addTodo(details) {
    const todo = {
      id: crypto.randomUUID(),
      ...details,
    };
    this.todos.push(todo);
    this.save();
  }

  editTodo(id, details) {
    const todo = this.getTodo(id);
    Object.assign(todo, { ...details });
    this.save();
  }

  toggleTodoStatus(id) {
    const todo = this.getTodo(id);
    todo.isDone = !todo.isDone;
    this.save();
  }

  deleteTodo(id) {
    this.#todos = this.todos.filter((todo) => todo.id !== id);
    this.save();
  }

  // Management tasks
  init(sampleData) {
    const data = JSON.parse(localStorage.getItem("collection")) || sampleData;
    data.forEach((item) => {
      this.addTodo(item);
    });
    this.save();
  }

  save() {
    localStorage.setItem("collection", JSON.stringify(this.todos));
  }

  clear() {
    localStorage.removeItem("collection");
    this.#todos = [];
  }

  // Filters
  getTodosByProject(project) {
    return this.todos.filter((todo) => todo.project === project);
  }

  getTodosByTimeFrame(timeFrame) {
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
        break;
    }

    return this.todos.filter((todo) => predicate(todo.dueDate));
  }

  // Getters
  get todos() {
    return this.#todos;
  }

  get projects() {
    // [...new Set(array)] to get uniqu values
    const uniqueProjects = [...new Set(this.todos.map((todo) => todo.project))];
    return uniqueProjects.filter((project) => project !== "Inbox"); // Don't include inbox
  }
}

export { Collection };
