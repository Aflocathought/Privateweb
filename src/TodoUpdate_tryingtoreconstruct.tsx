import React, { useEffect, useState } from "react";
import "./App.css";
import { find, IDropdownOption } from "@fluentui/react";
import debounce from "lodash.debounce";
import { Option, Textarea, Divider } from "@fluentui/react-components";
import { Select, ColorPicker, theme, Button, Checkbox } from "antd";
import {
  cyan,
  generate,
  gold,
  green,
  lime,
  magenta,
  orange,
  presetPalettes,
  purple,
  red,
} from "@ant-design/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, fas } from "@fortawesome/free-solid-svg-icons";
import MyCalendar from "./Calendar";
import type { ColorPickerProps } from "antd";

type Presets = Required<ColorPickerProps>["presets"][number];

import {
  faTrash,
  faPlus,
  faCheck,
  faHistory,
  faArrowDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

declare global {
  interface Window {
    colorTodos: () => void;
    clearTodos: () => void;
  }
}

/**
 * This function updates the backgroundColor property of each todo item in localStorage.
 * It calculates the backgroundColor based on the color property of the todo item.
 * If the todo item does not have a backgroundColor property, it adds one.
 * After updating the todo items, it saves them back to localStorage.
 * It returns a message indicating whether the update was successful or not.
 */
window.colorTodos = function () {
  console.log(
    "此函数更新所有todos中backgroundColor的属性（如果没有）。由每个todo的color属性去计算backgroundColor。"
  );
  let storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    let parsedTodos = JSON.parse(storedTodos);
    for (let i = 0; i < parsedTodos.length; i++) {
      if (!parsedTodos[i].hasOwnProperty("backgroundColor")) {
        parsedTodos[i].backgroundColor = calculateBackgroundColor(
          parsedTodos[i].color
        );
      }
    }
    localStorage.setItem("todos", JSON.stringify(parsedTodos));
    return "Background colors updated successfully!";
  } else {
    return "No todos found in localStorage.";
  }
};

function calculateBackgroundColor(color: string) {
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
}
function calculateBackgroundColor2(color: string) {
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
}

window.clearTodos = function () {
  console.log("此函数删除所有的todos。确定要吗？(y/n)");
  if (window.confirm("Are you sure you want to delete all todos?")) {
    localStorage.removeItem("todos");
    return "All todos deleted successfully!";
  }
};

export const Todo = () => {
  /**
   * 解决鼠标碰到输入法时触发鼠标离开的问题
   * @param e
   * @returns
   */
  const handleMouseLeave = (e: { screenX: number; screenY: number }) => {
    if (
      (e.screenX === 0 && e.screenY === 0) ||
      typing ||
      isEditing ||
      isEditingSubtask
    ) {
      return;
    }

    setHoverIndex(null);
    setIsEditing(false);
  };
  /**
   * 解决鼠标碰到输入法时触发鼠标离开的问题
   * @param e
   * @returns
   */
  const handleMouseLeaveinSubtask = (e: {
    screenX: number;
    screenY: number;
  }) => {
    if ((e.screenX === 0 && e.screenY === 0) || isEditingSubtask) {
      return;
    }

    setIsEditingSubtask(false);
  };
  interface SubTask {
    text: string;
    completed: boolean;
    origin: number;
    index: number;
    selfcollapsed: boolean;
  }
  // 定义待办事项的类型
  interface TodoItem {
    ID: number;
    title: string;
    timestamp: number;
    describe: string;
    color: string;
    backgroundColor: string;
    subtasks: SubTask[];
    icon: string;
    state: number;
    deadline: Date | number;
    completed: boolean;
    completedtime: number;
    transform: string;
    subtaskscollapsed: boolean;
    updatetime: number;
  }
  interface TodoManager {}

  // #region Variables

  const [input, setInput] = useState<string>("");
  const [subInput, setSubInput] = useState<string>("");

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverIndexinSubtask, setHoverIndexinSubtask] = useState<number | null>(
    null
  );

  const [undoStack, setUndoStack] = useState([]);

  const iconOptions: IDropdownOption[] = Object.keys(fas).map((iconName) => ({
    key: iconName,
    text: iconName,
  }));

  const [dateTime, setDateTime] = useState<Date | number>(0);
  const [changeDateTime, setChangeDateTime] = useState<Date | number>(0);
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerinTask, setShowPickerinTask] = useState(false);

  const [changeIconPanel, setChangeIconPanel] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [_, setAddSubtasksPanel] = useState(false);

  const [colorInput, setColorInput] = useState<string>("#000000");
  const [__, setChangeColorPanel] = useState(false);
  const debouncedSetColorInput = debounce(setColorInput, 100);
  const genPresets = (presets = presetPalettes) =>
    Object.entries(presets).map<Presets>(([label, colors]) => ({
      label,
      colors,
      defaultOpen: false,
    }));
  const { token } = theme.useToken();
  const colorpreset = genPresets({
    red,
    magenta,
    orange,
    gold,
    lime,
    green,
    cyan,
    primary: generate(token.colorPrimary),
    purple,
  });
  const [typing, setTyping] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSubtask, setIsEditingSubtask] = useState(false);

  const [deletedSubtasks, setDeletedSubtask] = useState<SubTask[]>([]);
  const [deletedTodos, setDeletedTodos] = useState<TodoItem[]>([]);

  iconOptions.unshift({ key: "", text: "无（请选择图标）" });
  // #endregion
  class SubTask {
    constructor(
      text: string,
      completed: boolean,
      origin: number,
      index: number,
      selfcollapsed: boolean
    ) {
      this.text = text;
      this.completed = completed;
      this.origin = origin;
      this.index = index;
      this.selfcollapsed = selfcollapsed;
    }

    public completeSubtask = () => {
      this.completed = !this.completed;
    };

    public subtaskChange = (text: string) => {
      this.text = text;
    };
  }

  class TodoItem {
    constructor(
      ID: number,
      title: string,
      describe: string,
      color: string,
      backgroundColor: string,
      subtasks: SubTask[],
      icon: string,
      state: number,
      deadline: Date | number,
      completed: boolean,
      completedtime: number,
      transform: string,
      subtaskscollapsed: boolean,
      updatetime: number
    ) {
      this.ID = ID;
      this.title = title;
      this.timestamp = timestamp;
      this.describe = describe;
      this.color = color;
      this.backgroundColor = backgroundColor;
      this.subtasks = subtasks;
      this.icon = icon;
      this.state = state;
      this.deadline = deadline;
      this.completed = completed;
      this.completedtime = completedtime;
      this.transform = transform;
      this.subtaskscollapsed = subtaskscollapsed;
      this.updatetime = updatetime;
    }
    public changeColor = (color: string) => {
      this.color = color;
      this.backgroundColor = calculateBackgroundColor(color);
    };
    public changeIcon = (icon: string) => {
      this.icon = icon;
    };
    public changeTitle = (title: string) => {
      this.title = title;
    };
    public completeTodo = () => {
      this.completed = !this.completed;
      if (this.completed) {
        this.completedtime = Date.now();
      } else {
        this.completedtime = 0;
      }
    };
    public changeDDL = (date: Date) => {
      this.deadline = date;
    };

    public addSubtask = (text: string) => {
      const now = Date.now();
      const newSubtask = new SubTask(text, false, this.ID, now, false);
      this.subtasks.push(newSubtask);
    };

    public findSubtaskIndex = (index: number) => {
      return this.subtasks.findIndex((subtask) => subtask.index === index);
    };

    public delSubtask = (ID: number) => {
      const index = this.findSubtaskIndex(ID);
      if (index !== -1) {
        deletedSubtasks.push(this.subtasks[index]);
        this.subtasks.splice(ID, 1);
      }
    };

    public collapseSubtask = () => {
      this.subtaskscollapsed = !this.subtaskscollapsed;
    };
  }

  class TodoManager {
    public todos: TodoItem[] = [];

    constructor() {
      this.loadTodos();
    }

    public loadTodos = () => {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        this.todos = JSON.parse(storedTodos);
      }
    };

    public sortTodo = () => {
      this.todos.sort((a, b) =>
        a.completed === b.completed ? 0 : a.completed ? 1 : -1
      );
    };

    public saveTodo = () => {
      // 将新的待办事项列表保存到 localStorage
      localStorage.setItem("todos", JSON.stringify(this.todos));
    };

    public findTodoIndex = (ID: number) => {
      return this.todos.findIndex((todo) => todo.ID === ID);
    };

    public addTodo = (title:string,color:string,icon:string,deadline: ) => {
      const colorInput1 = color;
      const iconInput1 = icon;
      const now = Date.now();
      const newTodo = new TodoItem(
        now,
        title,
        "",
        colorInput1,
        calculateBackgroundColor(colorInput1),
        [],
        iconInput1,
        0,
        dateTime,
        false,
        0,
        "",
        false,
        now
      );
      this.todos.push(newTodo);
      this.sortTodo();
      setInput("");
      setDateTime(0);
      setColorInput("#000000"); // 重置颜色输入
      setSelectedIcon(""); // 重置图标输入
      this.saveTodo();
    };

    /**
     * delTodo
     */
    public delTodo = (ID: number) => {
      const index = this.findTodoIndex(ID);
      if (index !== -1) {
        deletedTodos.push(this.todos[index]);
        this.todos.splice(index, 1);
        this.saveTodo();
      }
    };

    public undoDelTodo = () => {
      const todo = deletedTodos.pop();
      if (todo) {
        this.todos.push(todo);
        this.sortTodo();
        this.saveTodo();
      }
    };

    public undoDelSubtask = () => {
      const subtask = deletedSubtasks.pop();
      for (const todo of this.todos) {
        if (subtask?.origin === todo.ID) {
          todo.subtasks.push(subtask);
          this.saveTodo();
          return;
        }
      }
    };

    public moveTodo = (ID: number, direction: number) => {
      const index = this.findTodoIndex(ID);
      if (index !== -1) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < this.todos.length) {
          const todo = this.todos[index];
          this.todos.splice(index, 1);
          this.todos.splice(newIndex, 0, todo);
          this.saveTodo();
        }
      }
    };

    public movetoTop = (ID: number) => {
      const index = this.findTodoIndex(ID);
      if (index !== -1) {
        const todo = this.todos[index];
        this.todos.splice(index, 1);
        this.todos.unshift(todo);
        this.saveTodo();
      }
    };
    public UncompleteSubtaskNumber = (ID: number) => {
      const todo = this.todos.find((todo) => todo.ID === ID);
      if (!todo || !todo.subtasks) {
        return 0;
      }
      return todo.subtasks.filter((subtask) => !subtask.completed).length;
    };
  }
  const [manager] = useState(new TodoManager());
  return (
    <div className="Todo">
      {/* 主界面 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          backgroundColor: "white",
          width: "400px",
          zIndex: 100,
        }}
      >
        <div className="mt-4">
          <form
            onSubmit={manager.addTodo}
            onKeyDown={(event) => {
              if (event.ctrlKey && event.key === "Enter") {
                manager.addTodo();
              }
            }}
          >
            <Textarea
              className="TodoInputtask"
              onCompositionStart={() => setTyping(true)}
              onCompositionEnd={() => setTyping(false)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="今天要做什么……"
            />
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button onClick={manager.addTodo} style={{ width: "50%" }}>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
                <ColorPicker
                  className="ml-2"
                  value={colorInput}
                  presets={colorpreset}
                  showText={false}
                  onChange={(e) => debouncedSetColorInput(e.toHexString())}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Select
                    showSearch={true}
                    defaultValue=""
                    placeholder="请选择图标"
                    onChange={(e) => setSelectedIcon(e)}
                    onSearch={() => setTyping(true)}
                    onBlur={() => setTyping(false)}
                    style={{
                      width: "180px",
                      height: "40px",
                      marginLeft: "10px",
                    }}
                  >
                    {iconOptions.map((option) => (
                      <Option key={option.key}>{option.text}</Option>
                    ))}
                  </Select>
                  <div style={{ marginLeft: "10px" }}>
                    {selectedIcon === "" ? null : (
                      <FontAwesomeIcon icon={fas[selectedIcon]} />
                    )}
                  </div>
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <Button
                  className="mt-1"
                  onClick={() => {
                    setShowPicker(!showPicker);
                  }}
                >
                  {dateTime === 0 ? "添加截止时间" : dateTime.toLocaleString()}
                </Button>
                {showPicker && (
                  <>
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      onClick={() => setShowPicker(false)} // 点击遮罩层隐藏组件
                    />
                    <div className="calendarininput">
                      <MyCalendar
                        onButtonClick={(value) => setDateTime(value)}
                        onSelect={(date) => setDateTime(date.toDate())}
                      ></MyCalendar>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
          <Button onClick={manager.undoDelTodo}>撤销删除Todo</Button>
          <Button
            onClick={manager.undoDelSubtask}
            style={{ marginLeft: "10px" }}
          >
            撤销删除子任务
          </Button>
          <Divider className="mt-2" />
        </div>
      </div>

      {/* 主界面 */}

      {/* 待办事项列表 */}
      <ul className="TodoMain" style={{ marginTop: "190px" }}>
        {manager.todos.map((todo, index) => (
          <div
            className="todo"
            key={index}
            style={{
              border: todo.completed
                ? "1px solid gray"
                : `1px solid ${todo.color}`, // 添加边框
              backgroundColor: `${
                todo.completed ? "rgba(211,211,211,0.5)" : todo.backgroundColor
              }`,
            }}
            onMouseEnter={() => {
              setHoverIndex(index);
            }}
            onBlur={() => {
              setChangeIconPanel(false);
              setChangeColorPanel(false);
            }}
            onMouseLeave={(e) => {
              handleMouseLeave(e);
            }}
          >
            <li key={index}>
              <div
                className="flex flex-col"
                style={{
                  color: todo.completed ? "gray" : todo.color,
                  width: "100%",
                  fontSize: "20px",
                }}
              >
                <div
                  className="flex justify-between"
                  style={{
                    width: "100%",
                    color: todo.completed ? "gray" : todo.color,
                    fontSize: "20px",
                  }}
                >
                  <div
                    className="flex flex-col"
                    style={{
                      width: "100%",
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                  >
                    {/* 标题行 */}
                    <div
                      className="flex items-center justify-between"
                      style={{ width: "100%" }}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className={`mr-2 rotate-icon ${
                            todo.subtaskscollapsed ? "collapsed" : ""
                          }`}
                          style={{
                            fontSize: "30px",
                          }}
                          onClick={() => {
                            todo.collapseSubtask();
                          }}
                        ></FontAwesomeIcon>
                        {hoverIndex === index && isEditing ? (
                          <input
                            className="inputInSubtasks"
                            value={todo.title}
                            onChange={(e) => todo.changeTitle(e.target.value)}
                            onBlur={() => {
                              setIsEditing(false);
                            }}
                            autoFocus
                          />
                        ) : (
                          <span
                            onDoubleClick={() => {
                              setIsEditing(true);
                            }}
                          >
                            {todo.title}
                          </span>
                        )}
                        <div
                          style={{
                            marginLeft: "10px",
                            borderRadius: "30%",
                            backgroundColor: todo.completed
                              ? "rgba(211,211,211,0.5)"
                              : calculateBackgroundColor2(todo.color),
                          }}
                        >
                          <span
                            style={{
                              margin: "7px",
                              fontWeight: "normal",
                              fontSize: "18px",
                            }}
                          >
                            {manager.UncompleteSubtaskNumber(todo.ID)}
                          </span>
                        </div>
                      </div>
                      {/*图标*/}
                      <div style={{ display: "flex" }}>
                        {todo.icon === "" ? (
                          <>
                            {hoverIndex === index && (
                              <div style={{ position: "relative" }}>
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  style={{ fontSize: "30px" }}
                                  onClick={() => {
                                    setChangeIconPanel(!changeIconPanel);
                                  }}
                                />
                                {hoverIndex === index && changeIconPanel && (
                                  <Select
                                    className="fadeIn cicon"
                                    showSearch={true}
                                    placeholder="请选择图标"
                                    onChange={(e) =>
                                      todo.changeIcon(e.toString())
                                    }
                                  >
                                    {iconOptions.map((option) => (
                                      <Option key={option.key}>
                                        {option.text}
                                      </Option>
                                    ))}
                                  </Select>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ position: "relative" }}>
                            <FontAwesomeIcon
                              icon={fas[todo.icon]}
                              style={{ fontSize: "30px" }}
                              onClick={() =>
                                setChangeIconPanel(!changeIconPanel)
                              }
                            />
                            {hoverIndex === index && changeIconPanel && (
                              <Select
                                className="fadeIn cicon"
                                showSearch={true}
                                placeholder="请选择图标"
                                onChange={(e) => todo.changeIcon(e.toString())}
                              >
                                {iconOptions.map((option) => (
                                  <Option key={option.key}>
                                    {option.text}
                                  </Option>
                                ))}
                              </Select>
                            )}
                          </div>
                        )}
                      </div>
                      {/*图标*/}
                    </div>
                    {/*子任务呈现*/}
                    <ul>
                      <div
                        key={index}
                        style={{ display: "flex", flexDirection: "column" }}
                        className={`subtaskcollapse ${
                          todo.subtaskscollapsed ? "collapsed" : ""
                        }`}
                        onMouseLeave={(e) => {
                          handleMouseLeaveinSubtask(e);
                        }}
                      >
                        {(todo.subtasks || []).map((subtask, subindex) => (
                          <>
                            <div
                              key={subindex}
                              className="todoSubtasks"
                              onMouseEnter={() => {
                                setHoverIndexinSubtask(subindex);
                              }}
                            >
                              <div className="flex content-center items-center">
                                <Checkbox
                                  key={subindex}
                                  checked={todo.subtasks[subindex].completed}
                                  onChange={() => {
                                    subtask.completeSubtask();
                                  }}
                                  style={{
                                    color: todo.color,
                                  }}
                                />

                                <div className="flex flex-col">
                                  {hoverIndex === index &&
                                  hoverIndexinSubtask === subindex &&
                                  isEditingSubtask ? (
                                    <textarea
                                      className="ccontentinstask"
                                      value={todo.subtasks[subindex].text}
                                      onChange={(e) =>
                                        subtask.subtaskChange(e.target.value)
                                      }
                                      onBlur={() => {
                                        setIsEditingSubtask(false);
                                      }}
                                      autoFocus
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        fontSize: "15px",
                                        marginLeft: "10px",
                                        textDecoration: subtask.completed
                                          ? "line-through"
                                          : "none",
                                      }}
                                    >
                                      <span
                                        onDoubleClick={() => {
                                          setIsEditingSubtask(true);
                                        }}
                                      >
                                        {subtask.text}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {hoverIndex === index && (
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  style={{ marginLeft: "10px" }}
                                  onClick={() => todo.delSubtask(subtask.index)}
                                />
                              )}
                            </div>
                          </>
                        ))}
                      </div>
                    </ul>
                    {hoverIndex === index && (
                      <div className="flex content-center mt-2">
                        <Button
                          className="fadeIn"
                          style={{
                            border: `1px solid ${
                              todo.completed ? "gray" : todo.color
                            }`,
                            background: todo.completed
                              ? "rgba(211,211,211,0.5)"
                              : todo.backgroundColor,
                            color: todo.completed ? "gray" : todo.color,
                          }}
                          onClick={() => {
                            todo.addSubtask(subInput);
                          }}
                        >
                          <div
                            className="items-center"
                            style={{ display: "flex" }}
                          >
                            <FontAwesomeIcon icon={faPlus} className="mr-1" />
                            <p>添加子任务</p>
                          </div>
                        </Button>

                        <div>
                          <form
                            onSubmit={(event) => {
                              todo.addSubtask(event.toString());
                            }}
                          >
                            <input
                              className="addcontentinstask"
                              onCompositionStart={() => setTyping(true)}
                              onCompositionEnd={() => setTyping(false)}
                              value={subInput}
                              onChange={(e) => {
                                setSubInput(e.target.value);
                              }}
                              placeholder="……"
                            />
                          </form>
                        </div>
                      </div>
                    )}
                    <div style={{ position: "relative" }}>
                      {todo.deadline !== 0 ? (
                        <p
                          style={{ marginTop: "20px", fontSize: "10px" }}
                          onClick={() => {
                            setShowPickerinTask(!showPickerinTask);
                          }}
                        >
                          期限 {new Date(todo.deadline).toLocaleString()}
                        </p>
                      ) : (
                        hoverIndex === index && (
                          <Button
                            className="mt-1 mb-1"
                            onClick={() => {
                              setShowPickerinTask(!showPickerinTask);
                            }}
                            style={{
                              border: `1px solid ${
                                todo.completed ? "gray" : todo.color
                              }`,
                              background: todo.completed
                                ? "rgba(211,211,211,0.5)"
                                : todo.backgroundColor,
                              color: todo.completed ? "gray" : todo.color,
                            }}
                          >
                            {changeDateTime === 0
                              ? "添加截止时间"
                              : changeDateTime.toLocaleString()}
                          </Button>
                        )
                      )}
                      {hoverIndex === index && showPickerinTask && (
                        <div
                          className="calendarintodo"
                          onBlur={() => setShowPickerinTask(false)}
                        >
                          <MyCalendar
                            onSelect={(date) => todo.changeDDL(date.toDate())}
                          ></MyCalendar>
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {todo.completed && (
                        <p style={{ fontSize: "10px", marginTop: "10px" }}>
                          完成于 {new Date(todo.completedtime).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/*其他隐藏起来的元素*/}
            <div className="flex content-center">
              {hoverIndex === index && (
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <div
                      className="flex"
                      style={{
                        color: todo.completed ? "gray" : todo.color,
                      }}
                    >
                      <Button
                        className="fadeIn"
                        style={{
                          border: `1px solid ${
                            todo.completed ? "gray" : todo.color
                          }`,
                          background: todo.completed
                            ? "rgba(211,211,211,0.5)"
                            : todo.backgroundColor,
                          color: todo.completed ? "gray" : todo.color,
                        }}
                        onClick={() => todo.completeTodo()}
                      >
                        {todo.completed ? (
                          <FontAwesomeIcon icon={faHistory} />
                        ) : (
                          <FontAwesomeIcon icon={faCheck} />
                        )}
                      </Button>

                      <Button
                        className="fadeIn ml-3"
                        style={{
                          border: `1px solid ${
                            todo.completed ? "gray" : todo.color
                          }`,
                          background: todo.completed
                            ? "rgba(211,211,211,0.5)"
                            : todo.backgroundColor,
                          color: todo.completed ? "gray" : todo.color,
                        }}
                        onClick={() => manager.delTodo(todo.ID)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>

                      <ColorPicker
                        className="fadeIn z-2 ml-3"
                        presets={colorpreset}
                        showText={false}
                        defaultValue={todo.color}
                        onChangeComplete={(e) =>
                          todo.changeColor(e.toHexString())
                        }
                      />
                    </div>
                    <p
                      className="fadeIn mt-1"
                      style={{
                        fontSize: "10px",
                        color: todo.completed ? "gray" : todo.color,
                      }}
                    >
                      这条Todo添加于{new Date(todo.timestamp).toLocaleString()}
                      {/* <br />
                      最后更新于{new Date(todo.updatetime).toLocaleString()} */}
                    </p>
                  </div>
                  <div className="flex">
                    <Button
                      className="fadeIn ml-5 "
                      style={{
                        border: `1px solid ${
                          todo.completed ? "gray" : todo.color
                        }`,
                        background: todo.completed
                          ? "rgba(211,211,211,0.5)"
                          : todo.backgroundColor,
                        color: todo.completed ? "gray" : todo.color,
                      }}
                      onClick={() => manager.movetoTop(todo.ID)}
                    >
                      <FontAwesomeIcon icon={faArrowUp} />
                      <FontAwesomeIcon icon={faArrowUp} />
                    </Button>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Button
                        className="fadeIn ml-3"
                        style={{
                          border: `1px solid ${
                            todo.completed ? "gray" : todo.color
                          }`,
                          background: todo.completed
                            ? "rgba(211,211,211,0.5)"
                            : todo.backgroundColor,
                          color: todo.completed ? "gray" : todo.color,
                        }}
                        onClick={() => manager.moveTodo(index, 1)}
                      >
                        <FontAwesomeIcon icon={faArrowUp} />
                      </Button>
                      <Button
                        className="fadeIn ml-3 mt-2"
                        style={{
                          border: `1px solid ${
                            todo.completed ? "gray" : todo.color
                          }`,
                          background: todo.completed
                            ? "rgba(211,211,211,0.5)"
                            : todo.backgroundColor,
                          color: todo.completed ? "gray" : todo.color,
                        }}
                        onClick={() => manager.moveTodo(index, 1)}
                      >
                        <FontAwesomeIcon icon={faArrowDown} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/*隐藏起来的元素*/}
          </div>
        ))}
        <div style={{ height: "200px", width: "100%" }} />
      </ul>
      {/* 待办事项列表 */}
    </div>
  );
};

export default Todo;
