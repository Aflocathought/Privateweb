import React, { useEffect, useState } from "react";
import "./Todo.css";
import "../index.css";
import { IDropdownOption } from "@fluentui/react";
import { Divider } from "@fluentui/react-components";
import { Button, Checkbox } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { MyCalendar } from "../Components/Base/MyCalendar";
import { Icon } from "./Components/Icon";
import { CombinedInput } from "./Components/CombinedInput";

import { MyColorPicker } from "../Components/Base/ColorPicker/MyColorPicker";

import {
  calculateBackgroundColor2,
  calculateBackgroundColor,
} from "./TodoFunction";

import {
  faTrash,
  faPlus,
  faCheck,
  faHistory,
  faArrowDown,
  faArrowUp,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

interface SubTasks {
  text: string;
  completed: boolean;
  origin: number;
  index: number;
  selfcollapsed: boolean;
}
// 定义待办事项的类型
export interface TodoItem {
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

export const Todo = () => {
  // #region Variables
  const [todos, setTodos] = useState<TodoItem[]>([]);
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
  const [changeDateTime, setChangeDateTime] = useState<Date | number>(0);
  const [showPickerinTask, setShowPickerinTask] = useState(false);

  const [_, setAddSubtasksPanel] = useState(false);

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

  const changeIconFix = (ID: number, iconName: string) => {
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].ID === ID) {
        todos[i].icon = iconName;
        todoRefreshTime(i);
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    }
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

  /**
   * 添加新的待办事项
   * @param e
   */

  const addTodo = (data: TodoItem) => {
    const newTodos = [...todos, data];
    newTodos.sort((a, b) =>
      a.completed === b.completed ? 0 : a.completed ? 1 : -1
    );
    // console.log(selectedIcon);
    setTodos(newTodos);

    // 将新的待办事项列表保存到 localStorage
    localStorage.setItem("todos", JSON.stringify(newTodos));
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

  const getTodoColorStyle = (ID: number) => {
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].ID === ID) {
        return {
          border: `1px solid ${todos[i].completed ? "gray" : todos[i].color}`,
          background: todos[i].completed
            ? "rgba(211,211,211,0.5)"
            : todos[i].backgroundColor,
          color: todos[i].completed ? "gray" : todos[i].color,
        };
      }
    }
  };
  const saveTodosToFile = (todos: TodoItem[]) => {
    const blob = new Blob([JSON.stringify(todos, null, 2)], {
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

  return (
    <div className="Todo">
      {/* 主界面 */}
      <div
        style={{
          top: 0,
          backgroundColor: "white",
          width: "400px",
          height: "100%",
          zIndex: 100,
          marginRight: "10px",
        }}
      >
        <div className="mt-4 flex-col">
          <CombinedInput
            exportData={(data) => {
              addTodo(data);
            }}
          />
          <div>
            <Button onClick={undoDelTodo}>撤销删除</Button>
            <Button onClick={undoDelSubtask} style={{ marginLeft: "10px" }}>
              撤销删除子任务
            </Button>
            <Button onClick={() => saveTodosToFile(todos)} style={{ marginLeft: "10px" }}>保存Todo</Button>
          </div>
          <Divider className="mt-2" />
        </div>
        <div></div>
      </div>
      {/* 主界面 */}

      {/* 待办事项列表 */}
      <ul className="TodoMain" style={{ marginLeft: "10px", display: "flex" }}>
        {todos.map((todo, index) => (
          <div
            className="todo"
            key={index}
            style={getTodoColorStyle(todo.ID)}
            onMouseEnter={() => {
              setHoverIndex(index);
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
                        <Icon
                          IconSelect={(value) => {
                            changeIconFix(todo.ID, value);
                          }}
                          onIconInput={todo.icon === "" ? "faPlus" : todo.icon}
                          show={todo.icon === "" ? hoverIndex === index : true}
                        />
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
                          style={getTodoColorStyle(todo.ID)}
                          onClick={() => {
                            addSubtaskforButton(index);
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
                            style={getTodoColorStyle(todo.ID)}
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
                        style={getTodoColorStyle(todo.ID)}
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
                        style={getTodoColorStyle(todo.ID)}
                        onClick={() => delTodo(todos[index].ID)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>

                      {/* 暂时不能用不知道为啥注意一下↓ */}
                      <MyColorPicker
                        color={todos[index].color}
                        onSelect={(color) => changeColor(index, color)}
                      />
                      {/* 暂时不能用不知道为啥注意一下↑ */}
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
                      style={getTodoColorStyle(todo.ID)}
                      onClick={() => moveTop(index)}
                    >
                      <FontAwesomeIcon icon={faArrowUp} />
                      <FontAwesomeIcon icon={faArrowUp} />
                    </Button>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Button
                        className="fadeIn ml-3"
                        style={getTodoColorStyle(todo.ID)}
                        onClick={() => moveUpOrDown(index, -1)}
                      >
                        <FontAwesomeIcon icon={faArrowUp} />
                      </Button>
                      <Button
                        className="fadeIn ml-3 mt-2"
                        style={getTodoColorStyle(todo.ID)}
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
      </ul>
      {/* 待办事项列表 */}
    </div>
  );
};
