import React, { useEffect, useState } from "react";
import "./App.css";
import { IDropdownOption } from "@fluentui/react";
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

interface SubTasks {
  text: string;
  completed: boolean;
  origin: number;
  index: number;
  selfcollapsed: boolean;
}
// 定义待办事项的类型
interface TodoItem {
  ID: number;
  text: string;
  timestamp: number;
  describe: string;
  color: string;
  backgroundColor: string;
  subtasks: SubTasks[];
  icon: string;
  state: number;
  deadline: Date | number;
  completed: boolean;
  completedtime: number;
  transform: string;
  subtaskscollapsed: boolean;
  updatetime: number;
}

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

window.clearTodos = function () {
  console.log("此函数删除所有的todos。确定要吗？(y/n)");
  if (window.confirm("Are you sure you want to delete all todos?")) {
    localStorage.removeItem("todos");
    return "All todos deleted successfully!";
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

export const Todo = () => {
  // #region Variables
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const [input, setInput] = useState<string>("");
  const [subInput, setSubInput] = useState<string>("");

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverIndexinSubtask, setHoverIndexinSubtask] = useState<number | null>(
    null
  );

  const [deletedTodos, setDeletedTodos] = useState<TodoItem[]>([]);
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
 
  iconOptions.unshift({ key: "", text: "无（请选择图标）" });
  // #endregion

  // 在组件加载时从 localStorage 中读取待办事项列表
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  /**
   * （输入时）更改待办事项的颜色
   * @param index
   * @param color
   */
  const changeColor = (index: number, color: any) => {
    todos[index].color = color.toHexString();
    todos[index].backgroundColor = calculateBackgroundColor(
      color.toHexString()
    );
    todoRefreshTime(index);
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  /**
   * （输入时）更改待办事项的图标
   * @param index
   * @param iconName
   */
  const changeIcon = (index: number, iconName: string) => {
    todos[index].icon = iconName;
    setChangeIconPanel(false);
    todoRefreshTime(index);
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  /**
   * 更改待办事项的标题
   * @param e
   * @param index
   */
  const titleChange = (e: { target: { value: string } }, index: number) => {
    const newTodos = [...todos];
    newTodos[index].text = e.target.value;
    setTodos(newTodos);
    todoRefreshTime(index);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  /**
   * 更改子任务的标题
   * @param e
   * @param index
   * @param subindex
   */
  const subtaskChange = (
    e: { target: { value: string } },
    index: number,
    subindex: number
  ) => {
    const newTodos = [...todos];
    newTodos[index].subtasks[subindex].text = e.target.value;
    setTodos(newTodos);
    todoRefreshTime(index);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

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

  /**
   * 添加新的待办事项
   * @param e
   */
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      const now = Date.now();
      const newTodo: TodoItem = {
        ID: now,
        text: input,
        timestamp: now,
        describe: "",
        color: colorInput, // 使用用户输入的颜色
        backgroundColor: calculateBackgroundColor(colorInput),
        subtasks: [], // 默认没有子任务
        icon: selectedIcon, // 使用用户输入的图标
        state: 0,
        deadline: dateTime,
        completed: false, // 默认未完成
        completedtime: 0,
        transform: "",
        subtaskscollapsed: false,
        updatetime: Date.now(),
      };
      const newTodos = [...todos, newTodo];
      newTodos.sort((a, b) =>
        a.completed === b.completed ? 0 : a.completed ? 1 : -1
      );
      // console.log(selectedIcon);
      setTodos(newTodos);
      setInput("");
      setDateTime(0);
      setColorInput("#000000"); // 重置颜色输入
      setSelectedIcon(""); // 重置图标输入

      // 将新的待办事项列表保存到 localStorage
      localStorage.setItem("todos", JSON.stringify(newTodos));
    }
  };
  const delTodo = (ID: number) => {
    // 首先找到要删除的todo项
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].ID === ID) {
        const deletedTodo = todos[i];
        if (deletedTodo) {
          setDeletedTodos([...deletedTodos, deletedTodo]);
        }
        // 过滤掉具有指定ID的todo项
        const newTodos = todos.filter((todo) => todo.ID !== ID);
        // 更新todos状态
        setTodos(newTodos);
        // 更新localStorage中的数据
        localStorage.setItem("todos", JSON.stringify(newTodos));
      }
    }
    // 如果找到了要删除的todo项，则将其添加到deletedTodos数组中
  };
  const undoDelTodo = () => {
    if (deletedTodos.length > 0) {
      const lastDeletedTodo = deletedTodos[deletedTodos.length - 1];
      const newTodos = [...todos, lastDeletedTodo];
      newTodos.sort((a, b) =>
        a.completed === b.completed ? 0 : a.completed ? 1 : -1
      );
      setTodos(newTodos);
      setDeletedTodos(deletedTodos.slice(0, -1));
      localStorage.setItem("todos", JSON.stringify(newTodos));
    }
  };
  const completeTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    newTodos.sort((a, b) =>
      a.completed === b.completed ? 0 : a.completed ? 1 : -1
    );
    if (newTodos[index].completed) {
      newTodos[index].completedtime = Date.now();
    } else {
      newTodos[index].completedtime = 0;
    }
    setTodos(newTodos);
    todoRefreshTime(index);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };
  const changeDeadline = (Date: Date, index: number) => {
    setChangeDateTime(Date);
    setShowPickerinTask(false);
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      newTodos[index].deadline = Date;
      todoRefreshTime(index);
      return newTodos;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const moveUpOrDown = (index: number, direction: number) => {
    const newTodos = [...todos];
    const temp = newTodos[index];
    newTodos[index] = newTodos[index + direction];
    if (index + direction < 0 || index + direction >= newTodos.length) {
      return;
    } else {
      newTodos[index + direction] = temp;
    }
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };
  const moveTop = (index: number) => {
    const newTodos = [...todos];
    const temp = newTodos[index];
    newTodos.splice(index, 1);
    newTodos.unshift(temp);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };
  const addSubtask = (
    event: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    event.preventDefault();
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      const NewSubTask = {
        text: subInput,
        completed: false,
        origin: newTodos[index].ID,
        index: Date.now(),
        selfcollapsed: false,
      };
      newTodos[index].subtasks.push(NewSubTask);
      return newTodos;
    });
    setSubInput("");
    setAddSubtasksPanel(false);
    todoRefreshTime(index);
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const addSubtaskforButton = (index: number) => {
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      const NewSubTask = {
        text: subInput,
        completed: false,
        origin: newTodos[index].ID,
        index: newTodos[index].subtasks.length,
        selfcollapsed: false,
      };
      newTodos[index].subtasks.push(NewSubTask);
      return newTodos;
    });
    setSubInput("");
    setAddSubtasksPanel(false);
    todoRefreshTime(index);
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const delSubtask = (index: number, subtaskID: number) => {
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      // 确保对应的todo存在
      if (!newTodos[index]) return prevTodos; // 如果不存在，直接返回原始todos
      for (let i = 0; i < newTodos[index].subtasks.length; i++) {
        if (newTodos[index].subtasks[i].index === subtaskID) {
          const deletedSubtask = newTodos[index].subtasks.splice(i, 1)[0];
          //@ts-ignore
          setUndoStack([...undoStack, deletedSubtask]);
          todoRefreshTime(index);
        }
      }
      return newTodos;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const completeSubtask = (index: number, subindex: number, check: boolean) => {
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      newTodos[index].subtasks[subindex].completed = check;
      todoRefreshTime(index);
      return newTodos;
    });

    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const collapseSubtask = (index: number) => {
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      newTodos[index].subtaskscollapsed = !newTodos[index].subtaskscollapsed;
      return newTodos;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const undoDelSubtask = () => {
    if (undoStack.length > 0) {
      const newUndoStack = [...undoStack];
      const lastDeletedSubtask = newUndoStack.pop();
      setTodos((prevTodos) => {
        const newTodos = [...prevTodos];
        for (let i = 0; i < newTodos.length; i++) {
          // @ts-ignore
          if (newTodos[i].ID === lastDeletedSubtask.origin) {
            // @ts-ignore
            newTodos[i].subtasks.push(lastDeletedSubtask);
          }
        }
        localStorage.setItem("todos", JSON.stringify(newTodos));
        return newTodos;
      });
      setUndoStack(newUndoStack);
    }
  };

  function UncompleteSubtaskNumber(index: number) {
    let count = 0;
    for (let i = 0; i < todos[index].subtasks.length; i++) {
      if (!todos[index].subtasks[i].completed) {
        count++;
      }
    }
    return count;
  }
  const todoRefreshTime = (index: number) => {
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      newTodos[index].updatetime = Date.now();
      return newTodos;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  };

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
            onSubmit={addTodo}
            onKeyDown={(event) => {
              if (event.ctrlKey && event.key === "Enter") {
                addTodo(event);
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
                <Button onClick={addTodo} style={{ width: "50%" }}>
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
          <Button onClick={undoDelTodo}>撤销删除</Button>
          <Button onClick={undoDelSubtask} style={{ marginLeft: "10px" }}>
            撤销删除子任务
          </Button>
          <Divider className="mt-2" />
        </div>
      </div>

      {/* 主界面 */}

      {/* 待办事项列表 */}
      <ul className="TodoMain" style={{ marginTop: "190px" }}>
        {todos.map((todo, index) => (
          <div
            className="todo"
            key={index}
            style={{
              border: todo.completed
                ? "1px solid gray"
                : `1px solid ${todo.color}`, // 添加边框
              backgroundColor: `${
                todo.completed
                  ? "rgba(211,211,211,0.5)"
                  : todos[index].backgroundColor
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
                            todos[index].subtaskscollapsed ? "collapsed" : ""
                          }`}
                          style={{
                            fontSize: "30px",
                          }}
                          onClick={() => {
                            collapseSubtask(index);
                          }}
                        ></FontAwesomeIcon>
                        {hoverIndex === index && isEditing ? (
                          <input
                            className="inputInSubtasks"
                            value={todos[index].text}
                            onChange={(e) => titleChange(e, index)}
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
                            {todo.text}
                          </span>
                        )}
                        <div
                          style={{
                            marginLeft: "10px",
                            borderRadius: "30%",
                            backgroundColor: todo.completed
                              ? "rgba(211,211,211,0.5)"
                              : calculateBackgroundColor2(todos[index].color),
                          }}
                        >
                          <span
                            style={{
                              margin: "7px",
                              fontWeight: "normal",
                              fontSize: "18px",
                            }}
                          >
                            {UncompleteSubtaskNumber(index)}
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
                                    onChange={(e) => changeIcon(index, e)}
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
                                onChange={(e) => changeIcon(index, e)}
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
                          todos[index].subtaskscollapsed ? "collapsed" : ""
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
                                  checked={
                                    todos[index].subtasks[subindex].completed
                                  }
                                  onChange={(e) => {
                                    completeSubtask(
                                      index,
                                      subindex,
                                      e.target.checked
                                    );
                                  }}
                                  style={{
                                    color: todos[index].color,
                                  }}
                                />

                                <div className="flex flex-col">
                                  {hoverIndex === index &&
                                  hoverIndexinSubtask === subindex &&
                                  isEditingSubtask ? (
                                    <textarea
                                      className="ccontentinstask"
                                      value={
                                        todos[index].subtasks[subindex].text
                                      }
                                      onChange={(e) =>
                                        subtaskChange(e, index, subindex)
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
                                  onClick={() =>
                                    delSubtask(
                                      index,
                                      todos[index].subtasks[subindex].index
                                    )
                                  }
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
                              todo.completed ? "gray" : todos[index].color
                            }`,
                            background: todo.completed
                              ? "rgba(211,211,211,0.5)"
                              : todos[index].backgroundColor,
                            color: todo.completed ? "gray" : todos[index].color,
                          }}
                          onClick={() => {
                            addSubtaskforButton(index);
                          }}
                        >
                          <div
                            className="items-center"
                            style={{ display: "flex" }}
                          >
                            <FontAwesomeIcon icon={faPlus} className="mr-1"/>
                            <p>添加子任务</p>
                          </div>
                        </Button>

                        <div>
                          <form
                            onSubmit={(event) => {
                              addSubtask(event, index);
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
                      {todos[index].deadline !== 0 ? (
                        <p
                          style={{ marginTop: "20px", fontSize: "10px" }}
                          onClick={() => {
                            setShowPickerinTask(!showPickerinTask);
                          }}
                        >
                          期限{" "}
                          {new Date(todos[index].deadline).toLocaleString()}
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
                                todo.completed ? "gray" : todos[index].color
                              }`,
                              background: todo.completed
                                ? "rgba(211,211,211,0.5)"
                                : todos[index].backgroundColor,
                              color: todo.completed
                                ? "gray"
                                : todos[index].color,
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
                            onSelect={(date) =>
                              changeDeadline(date.toDate(), index)
                            }
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
                            todo.completed ? "gray" : todos[index].color
                          }`,
                          background: todo.completed
                            ? "rgba(211,211,211,0.5)"
                            : todos[index].backgroundColor,
                          color: todo.completed ? "gray" : todos[index].color,
                        }}
                        onClick={() => completeTodo(index)}
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
                            todo.completed ? "gray" : todos[index].color
                          }`,
                          background: todo.completed
                            ? "rgba(211,211,211,0.5)"
                            : todos[index].backgroundColor,
                          color: todo.completed ? "gray" : todos[index].color,
                        }}
                        onClick={() => delTodo(todos[index].ID)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>

                      <ColorPicker
                        className="fadeIn z-2 ml-3"
                        presets={colorpreset}
                        showText={false}
                        defaultValue={todos[index].color}
                        onChangeComplete={(e) => changeColor(index, e)}
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
                          todo.completed ? "gray" : todos[index].color
                        }`,
                        background: todo.completed
                          ? "rgba(211,211,211,0.5)"
                          : todos[index].backgroundColor,
                        color: todo.completed ? "gray" : todos[index].color,
                      }}
                      onClick={() => moveTop(index)}
                    >
                      <FontAwesomeIcon icon={faArrowUp} />
                      <FontAwesomeIcon icon={faArrowUp} />
                    </Button>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Button
                        className="fadeIn ml-3"
                        style={{
                          border: `1px solid ${
                            todo.completed ? "gray" : todos[index].color
                          }`,
                          background: todo.completed
                            ? "rgba(211,211,211,0.5)"
                            : todos[index].backgroundColor,
                          color: todo.completed ? "gray" : todos[index].color,
                        }}
                        onClick={() => moveUpOrDown(index, -1)}
                      >
                        <FontAwesomeIcon icon={faArrowUp} />
                      </Button>
                      <Button
                        className="fadeIn ml-3 mt-2"
                        style={{
                          border: `1px solid ${
                            todo.completed ? "gray" : todos[index].color
                          }`,
                          background: todo.completed
                            ? "rgba(211,211,211,0.5)"
                            : todos[index].backgroundColor,
                          color: todo.completed ? "gray" : todos[index].color,
                        }}
                        onClick={() => moveUpOrDown(index, 1)}
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
