import { Subtask, TodoItem } from "./Todo";
export const calculateBackgroundColor = (color: string) => {
  let r =
    parseInt(color.slice(1, 3), 16) + 70 > 255
      ? 255
      : parseInt(color.slice(1, 3), 16) + 70;
  let g =
    parseInt(color.slice(3, 5), 16) + 70 > 255
      ? 255
      : parseInt(color.slice(3, 5), 16) + 70;
  let b =
    parseInt(color.slice(5, 7), 16) + 70 > 255
      ? 255
      : parseInt(color.slice(5, 7), 16) + 70;
  let a = 0.18;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const calculateBackgroundColor2 = (color: string) => {
  let r =
    parseInt(color.slice(1, 3), 16) + 35 > 255
      ? 255
      : parseInt(color.slice(1, 3), 16) + 35;
  let g =
    parseInt(color.slice(3, 5), 16) + 35 > 255
      ? 255
      : parseInt(color.slice(3, 5), 16) + 35;
  let b =
    parseInt(color.slice(5, 7), 16) + 35 > 255
      ? 255
      : parseInt(color.slice(5, 7), 16) + 35;
  let a = 0.25;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export function UncompleteSubtaskNumber(subtasks: Subtask[]) {
  let count = 0;
  for (let i = 0; i < subtasks.length; i++) {
    if (!subtasks[i].completed) {
      count++;
    }
  }
  return count;
}

export const getTodoColorStyle = (todo: TodoItem) => {
  return {
    border: `1px solid ${todo.completed ? "gray" : todo.color}`,
    background: todo.completed ? "rgba(211,211,211,0.5)" : todo.backgroundColor,
    color: todo.completed ? "gray" : todo.color,
  };
};
