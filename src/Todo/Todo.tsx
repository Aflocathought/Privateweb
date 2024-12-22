import { stringify, parse } from "flatted";
import { EventBus } from "./Components/EventBus";

import {
  calculateBackgroundColor2,
  calculateBackgroundColor,
} from "./TodoFunction";
export const todoEventBus = new EventBus();

/**
 * 子任务的数据结构
 */
export interface SubTaskStructure {
  text: string;
  completed: boolean;
  originID: number;
  ID: number;
  selfcollapsed: boolean;
}

/**
 * Todo的数据结构
 */
export interface TodoStructure {
  ID: number;
  text: string;
  timestamp: number;
  describe: string;
  color: string;
  backgroundColor: string;
  subtasks: Subtask[];
  icon: string;
  state: number;
  deadline: Date | number;
  completed: boolean;
  completedtime: number;
  transform: string;
  subtaskscollapsed: boolean;
  updatetime: number;
}

/**
 * 子任务类
 */
export class Subtask implements SubTaskStructure {
  text: string;
  completed: boolean;
  originID: number;
  ID: number;
  selfcollapsed: boolean;

  manager: TodoItem | null;

  constructor(subtask: SubTaskStructure, manager?: TodoItem) {
    this.completed = subtask.completed;
    this.text = subtask.text;
    this.originID = subtask.originID;
    this.ID = subtask.ID;
    this.selfcollapsed = subtask.selfcollapsed;
    this.manager = manager || null;
  }
  private emitUpdate() {
    todoEventBus.emit(`todo-${this.originID}-${this.ID}-update`, this);
  }
  changeContent = (e: { target: { value: string } }) => {
    this.text = e.target.value;
    this.emitUpdate();
    this.manager!.writeTodo();
  };

  complete(checked: boolean) {
    this.completed = checked;
    this.emitUpdate();
    this.manager!.writeTodo();
  }
}

/**
 * 待办事项类
 */
export class TodoItem implements TodoStructure {
  ID: number;
  text: string;
  timestamp: number;
  describe: string;
  color: string;
  backgroundColor: string;
  subtasks: Subtask[];
  icon: string;
  state: number;
  deadline: Date | number;
  completed: boolean;
  completedtime: number;
  transform: string;
  subtaskscollapsed: boolean;
  updatetime: number;

  manager: TodoManager | null;

  constructor(todo: TodoStructure, manager?: TodoManager) {
    this.ID = todo.ID;
    this.text = todo.text;
    this.timestamp = todo.timestamp;
    this.describe = todo.describe;
    this.color = todo.color;
    this.backgroundColor = todo.backgroundColor;
    this.subtasks = todo.subtasks;
    this.icon = todo.icon;
    this.state = todo.state;
    this.deadline = todo.deadline;
    this.completed = todo.completed;
    this.completedtime = todo.completedtime;
    this.transform = todo.transform;
    this.subtaskscollapsed = todo.subtaskscollapsed;
    this.updatetime = todo.updatetime;
    this.manager = manager || null;

    this.subtasks = this.readSubtasks();
  }

  private emitUpdate() {
    todoEventBus.emit(`todo-${this.ID}-update`, this);
  }

  writeTodo = () => {
    this.emitUpdate();
    this.manager?.writeTodo();
  };

  readSubtasks = () => {
    return this.subtasks.map((subtask) => new Subtask(subtask, this));
  };

  setManager(manager: TodoManager) {
    this.emitUpdate();
    this.manager = manager;
  }

  changeColor = (color: string) => {
    this.color = color;
    this.backgroundColor = calculateBackgroundColor(color);
    this.emitUpdate();
    this.writeTodo();
  };

  changeIcon = (iconName: string) => {
    this.icon = iconName;
    this.emitUpdate();
    this.writeTodo();
  };

  changeTitle = (e: { target: { value: string } }) => {
    this.text = e.target.value;
    this.emitUpdate();
    this.writeTodo();
  };

  changeDeadline = (date: Date) => {
    this.deadline = date;
    this.emitUpdate();
    this.writeTodo();
  };

  completeTodo = () => {
    this.completed = !this.completed;
    this.completedtime = this.completed ? Date.now() : 0;
    this.manager?.sortTodos();
    this.emitUpdate();
    this.writeTodo();
  };

  addSubtask = (content: string, event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    this.subtasks.push(
      new Subtask({
        text: content,
        completed: false,
        originID: this.ID,
        ID: Date.now(),
        selfcollapsed: false,
      })
    );
    this.emitUpdate();
    this.writeTodo();
  };

  collapseSubtasks = () => {
    this.subtaskscollapsed = !this.subtaskscollapsed;
    this.emitUpdate();
    this.writeTodo();
  };

  deleteSubtask = (ID: number) => {
    const index = this.subtasks.findIndex((subtask) => subtask.ID === ID);
    if (index !== -1) {
      this.subtasks.splice(index, 1);
      this.manager?.deletedSubtasks.push(this.subtasks[index]);
      this.emitUpdate();
      this.writeTodo();
    }
  };
}

/**
 * Todo管理类
 */
export class TodoManager {
  public Todos: TodoItem[] = [];
  deletedTodos: TodoItem[] = [];
  deletedSubtasks: Subtask[] = [];

  constructor() {
    this.readTodo();
    this.Todos = this.Todos || [];
    this.deletedTodos = [];
  }

  private emitUpdate() {
    todoEventBus.emit("todoManager-update", this.Todos);
  }

  readTodo = () => {
    const storedTodos = localStorage.getItem("todostest");
    if (storedTodos) {
      const parsedTodos = parse(storedTodos);
      this.Todos = parsedTodos.map((todo: TodoStructure) => {
        const todoItem = new TodoItem(todo);
        todoItem.setManager(this); // 重新设置 manager
        return todoItem;
      });
    }
  };

  writeTodo = () => {
    const data = stringify(this.Todos);
    localStorage.setItem("todostest", data);
  };

  saveTodoToFile = () => {
    const blob = new Blob([stringify(this.Todos)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todos.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  sortTodos = () => {
    this.Todos.sort((a, b) => {
      return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
    });
  };

  addTodo = (todo: TodoStructure) => {
    this.Todos.push(new TodoItem(todo, this));
    this.sortTodos();
    this.emitUpdate();
    this.writeTodo();
  };

  deleteTodo = (ID: number) => {
    const index = this.Todos.findIndex((todo) => todo.ID === ID);
    if (index !== -1) {
      this.deletedTodos.push(this.Todos[index]);
      this.Todos.splice(index, 1);
      this.emitUpdate();
      this.writeTodo();
    }
  };

  undoDeleteTodo = () => {
    if (this.deletedTodos.length > 0) {
      this.Todos.push(this.deletedTodos.pop()!);
      this.emitUpdate();
      this.writeTodo();
    }
  };

  undoDeleteSubtask = () => {
    if (this.deletedSubtasks.length > 0) {
      const subtask = this.deletedSubtasks.pop()!;
      const parentTodo = this.Todos.find(
        (todo) => todo.ID === subtask.originID
      );
      if (parentTodo) {
        parentTodo.subtasks.push(subtask);
        subtask.manager = parentTodo;
        this.emitUpdate();
        this.writeTodo();
      }
    }
  };

  moveTodo = (ID: number, direction: number) => {
    const index = this.Todos.findIndex((todo) => todo.ID === ID);
    if (index !== -1) {
      const todo = this.Todos[index];
      this.Todos.splice(index, 1);
      this.Todos.splice(index + direction, 0, todo);
      this.emitUpdate();
      this.writeTodo();
    }
  };

  moveToTop = (ID: number) => {
    const index = this.Todos.findIndex((todo) => todo.ID === ID);
    if (index !== -1) {
      const todo = this.Todos[index];
      this.Todos.splice(index, 1);
      this.Todos.unshift(todo);
      this.emitUpdate();
      this.writeTodo();
    }
  };
}
