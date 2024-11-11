import React, { useEffect, useState } from "react";
import "./App.css";
import { IDropdownOption } from "@fluentui/react";
import debounce from "lodash.debounce";
import { Option } from "@fluentui/react-components";
import {  Select, ColorPicker, theme, Button, Checkbox } from "antd";
import { generate, green, presetPalettes, red } from "@ant-design/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import MyCalendar from "../Calendar/Calendar";
import type { ColorPickerProps } from "antd";

type Presets = Required<ColorPickerProps>["presets"][number];

import {
  faTrash,
  faPlus,
  faCheck,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";

interface SubTasks {
  text: string;
  completed: boolean;
  origin: number;
  index: number;
}
// 定义待办事项的类型
interface TodoItem {
  text: string;
  timestamp: number;
  describe: string;
  color: string;
  subtasks: SubTasks[];
  index: number;
  icon: string;
  state: number;
  deadline: Date | number;
  completed: boolean;
  completedtime: number;
  transform: string;
  subtaskscollapsed: boolean;
}

declare global {
  interface Window {
    clearTodos: () => void;
  }
}

export const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const [input, setInput] = useState<string>("");
  const [subInput, setSubInput] = useState<string>("");

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [deletedTodos, setDeletedTodos] = useState<TodoItem[]>([]);
  const [undoStack, setUndoStack] = useState([]);

  const [transform, setTransform] = useState("");

  const iconOptions: IDropdownOption[] = Object.keys(fas).map((iconName) => ({
    key: iconName,
    text: iconName,
  }));

  const [dateTime, setDateTime] = useState<Date | number>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [changeIconPanel, setChangeIconPanel] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [__, setAddSubtasksPanel] = useState(false);

  const [colorInput, setColorInput] = useState<string>("#000000");
  const [___, setChangeColorPanel] = useState(false);
  const debouncedSetColorInput = debounce(setColorInput, 100);
  const genPresets = (presets = presetPalettes) =>
    Object.entries(presets).map<Presets>(([label, colors]) => ({
      label,
      colors,
    }));
  const { token } = theme.useToken();
  const colorpreset = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
  });
  const [typing, setTyping] = useState(false);

  const changeColor = (index: number, color: any) => {
    todos[index].color = color.toHexString();
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const changeIcon = (index: number, iconName: string) => {
    todos[index].icon = iconName;
    setChangeIconPanel(false);
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const handleCalendarButtonClick = () => {
    setShowPicker(!showPicker);
  };

  iconOptions.unshift({ key: "", text: "无（请选择图标）" });
  // console.log(iconOptions);
  // console.log(fas);


  const [isEditing, setIsEditing] = useState(false);


  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleTitlechange = (
    e: { target: { value: string } },
    index: number
  ) => {
    const newTodos = [...todos];
    newTodos[index].text = e.target.value;
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    // 在这里，你可以更新 todo.text
  };
  const handleMouseLeave = (e: { screenX: number; screenY: number }) => {
    if ((e.screenX === 0 && e.screenY === 0) || typing) {
      return;
    }
    setHoverIndex(null);
    setTransform("");
  };

  // 在组件加载时从 localStorage 中读取待办事项列表
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  function culculateBackgroundColor(color: string) {
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

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      const newTodo: TodoItem = {
        index: todos.length,
        text: input,
        timestamp: Date.now(),
        describe: "",
        color: colorInput, // 使用用户输入的颜色
        subtasks: [], // 默认没有子任务
        icon: selectedIcon, // 使用用户输入的图标
        state: 0,
        deadline: dateTime,
        completed: false, // 默认未完成
        completedtime: 0,
        transform: "",
        subtaskscollapsed: false,
      };
      const newTodos = [...todos, newTodo];
      newTodos.sort((a, b) =>
        a.completed === b.completed ? 0 : a.completed ? 1 : -1
      );
      console.log(selectedIcon);
      setTodos(newTodos);
      setInput("");
      setColorInput("#000000"); // 重置颜色输入
      setSelectedIcon(""); // 重置图标输入

      // 将新的待办事项列表保存到 localStorage
      localStorage.setItem("todos", JSON.stringify(newTodos));
    }
  };

  const handleDeleteTodo = (index: number) => {
    const deletedTodo = todos[index];
    setDeletedTodos([...deletedTodos, deletedTodo]);
    const newTodos = todos.filter((_, todoIndex) => todoIndex !== index);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const handleUndoDelete = () => {
    if (deletedTodos.length > 0) {
      const lastDeletedTodo = deletedTodos[deletedTodos.length - 1];
      const newTodos = [...todos, lastDeletedTodo];
      newTodos.sort((a, b) =>
        a.completed === b.completed ? 0 : a.completed ? 1 : -1
      );
      setTodos(newTodos);
      setDeletedTodos(deletedTodos.slice(0, -1));
    }
  };

  const handleCompleteTodo = (index: number) => {
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
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const handleAddSubtask = (
    event: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    event.preventDefault();
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      const NewSubTask = {
        text: subInput,
        completed: false,
        origin: index,
        index: newTodos[index].subtasks.length,
      };
      newTodos[index].subtasks.push(NewSubTask);
      return newTodos;
    });
    setSubInput("");
    setAddSubtasksPanel(false);
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const handleAddSubtaskforButton = (index: number) => {
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      const NewSubTask = {
        text: subInput,
        completed: false,
        origin: index,
        index: newTodos[index].subtasks.length,
      };
      newTodos[index].subtasks.push(NewSubTask);
      return newTodos;
    });
    setSubInput("");
    setAddSubtasksPanel(false);
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const handleDeleteSubtask = (index: number, subindex: number) => {
    const deletedSubtask: SubTasks = todos[index].subtasks.splice(
      subindex,
      1
    )[0];
    // @ts-ignore
    setUndoStack([...undoStack, deletedSubtask]);
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const handleCompleteSubtask = (index: number, subindex: number) => {
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      newTodos[index].subtasks[subindex].completed =
        !newTodos[index].subtasks[subindex].completed;
      return newTodos;
    });

    localStorage.setItem("todos", JSON.stringify(todos));
  };
  function handleUndo() {
    if (undoStack.length > 0) {
      const lastDeletedSubtask = undoStack.pop();
      // 这里你需要知道 lastDeletedSubtask 应该被添加回到哪个 todo 的 subtasks 中
      // 假设它应该被添加回到 todos[0].subtasks 中
      //@ts-ignore
      todos[0].subtasks.push(lastDeletedSubtask);
      setUndoStack(undoStack);
      // 更新 todos
    }
  }

  return (
    <div
      style={{
        width: "600px",
        maxHeight: "100vh",
        height: "auto",
        backgroundColor: "rgba(255, 255, 255)",
        padding: "15px",
        border: "1px solid black", // 添加边框
        boxShadow: "10px 10px 10px rgba(0,0,0,0.5)", // 添加阴影
        margin: "10px",
        borderRadius: "15px",
        fontFamily: "Arial",
        overflowY: "auto",
      }}
    >
      {/* 主界面 */}
      <form onSubmit={handleAddTodo}>
        <input
          onCompositionStart={() => setTyping(true)}
          onCompositionEnd={() => setTyping(false)}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: "320px",
            height: "60px",
            padding: "5px",
            border: "1px solid #bbb",
            borderRadius: "4px",
          }}
          placeholder="今天要做什么……"
        />
        <div>
          <Button onClick={handleCalendarButtonClick}>
            {dateTime === 0 ? "添加截止时间" : dateTime.toLocaleString()}
          </Button>
          {showPicker && (
            <div
              style={{
                width: "auto",
                height: "auto",
                position: "absolute",
                zIndex: 100,
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                right: 0,
                borderRadius: "4px",
              }}
              onBlur={() => setShowPicker(false)}
            >
              <MyCalendar
                onSelect={(date) => setDateTime(date.toDate())}
                onButtonClick={() => setDateTime(0)}
              ></MyCalendar>
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button onClick={handleAddTodo}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <ColorPicker
            value={colorInput}
            style={{
              marginLeft: "10px",
            }}
            presets={colorpreset}
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
              style={{ width: "180px", height: "40px", marginLeft: "10px" }}
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
      </form>
      <button onClick={handleUndoDelete}>撤销删除</button>
      <button onClick={handleUndo}>撤销删除子任务</button>
      {/* 主界面 */}

      {/* 待办事项列表 */}
      <ul>
        {todos.map((todo, index) => (
          <div
            key={index}
            style={{
              left: "2%",
              width: "400px",
              height: "auto",
              padding: "15px",
              marginTop: "15px",
              boxSizing: "border-box",

              border: todo.completed
                ? "1px solid gray"
                : `1px solid ${todo.color}`, // 添加边框
              backgroundColor: `${
                todo.completed
                  ? "rgba(211,211,211,0.5)"
                  : culculateBackgroundColor(todo.color)
              }`,
              borderRadius: "15px",
              fontFamily: "Arial",
              transform: hoverIndex === index ? transform : "",
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={() => {
              setHoverIndex(index);
              setTransform("scale(1.1)");
            }}
            onBlur={() => {
              setChangeIconPanel(false);
              setChangeColorPanel(false);
              setTransform("");
            }}
            onMouseLeave={handleMouseLeave}
          >
            <li key={index}>
              <div
                style={{
                  color: todo.completed ? "gray" : todo.color,
                  fontSize: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    color: todo.completed ? "gray" : todo.color,
                    fontSize: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      fontSize: "25px",
                      marginTop: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    <div>
                      {isEditing ? (
                        <input
                          style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            width: "100%",
                          }}
                          value={todos[index].text}
                          onChange={(e) => handleTitlechange(e, index)}
                          onBlur={handleInputBlur}
                          autoFocus
                        />
                      ) : (
                        <span onClick={handleTextClick}>{todo.text}</span>
                      )}
                    </div>

                    {/*子任务呈现*/}
                    <ul>
                      <div
                        key={index}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        {(todo.subtasks || []).map((subtask, subindex) => (
                          <>
                            <div
                              key={subindex}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "15px",
                                marginLeft: "20px",
                                fontWeight: "normal",
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <Checkbox
                                  key={subindex}
                                  defaultChecked={
                                    todos[index].subtasks[subindex].completed
                                  }
                                  onChange={() => {
                                    handleCompleteSubtask(index, subindex);
                                  }}
                                  style={{
                                    color: todos[index].color,
                                  }}
                                />
                                <div
                                  style={{
                                    fontSize: "15px",
                                    marginLeft: "10px",
                                    textDecoration: subtask.completed
                                      ? "line-through"
                                      : "none",
                                  }}
                                >
                                  {subtask.text}
                                </div>
                              </div>
                              {hoverIndex === index && (
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  onClick={() =>
                                    handleDeleteSubtask(index, subindex)
                                  }
                                />
                              )}
                            </div>
                          </>
                        ))}
                      </div>
                    </ul>
                    {hoverIndex === index && (
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          marginTop: "10px",
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
                              : culculateBackgroundColor(todos[index].color),
                            color: todo.completed ? "gray" : todos[index].color,
                          }}
                          onClick={() => {
                            handleAddSubtaskforButton(index);
                          }}
                        >
                          <div
                            style={{ display: "flex", alignContent: "center" }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                            <p>添加子任务</p>
                          </div>
                        </Button>

                        <div>
                          <form
                            onSubmit={(event) => {
                              handleAddSubtask(event, index);
                            }}
                          >
                            <input
                              onCompositionStart={() => setTyping(true)}
                              onCompositionEnd={() => setTyping(false)}
                              value={subInput}
                              onChange={(e) => {
                                setSubInput(e.target.value);
                              }}
                              style={{
                                width: "200px",
                                height: "30px",
                                padding: "5px",
                                border: "1px solid #bbb",
                                borderRadius: "4px",
                                fontSize: "15px",
                                fontWeight: "normal",
                              }}
                              placeholder="……"
                            />
                          </form>
                        </div>
                      </div>
                    )}
                    <p style={{ marginTop: "20px", fontSize: "10px" }}>
                      期限 {todos[index].deadline.toLocaleString()}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {todo.completed && (
                        <p style={{ fontSize: "10px" }}>
                          完成于 {new Date(todo.completedtime).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/*图标*/}
                  {todo.icon === "" ? (
                    <>
                      {hoverIndex === index && (
                        <>
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{ fontSize: "30px" }}
                            onClick={() => setChangeIconPanel(!changeIconPanel)}
                          />
                          {hoverIndex === index && changeIconPanel && (
                            <Select
                              className="fadeIn"
                              showSearch={true}
                              placeholder="请选择图标"
                              onChange={(e) => changeIcon(index, e)}
                              style={{
                                width: "180px",
                                height: "40px",
                                position: "absolute",
                                zIndex: 100,
                                marginLeft: "10px",
                              }}
                            >
                              {iconOptions.map((option) => (
                                <Option key={option.key}>{option.text}</Option>
                              ))}
                            </Select>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={fas[todo.icon]}
                        style={{ fontSize: "30px" }}
                        onClick={() => setChangeIconPanel(!changeIconPanel)}
                      />
                      {hoverIndex === index && changeIconPanel && (
                        <Select
                          className="fadeIn"
                          showSearch={true}
                          placeholder="请选择图标"
                          onChange={(e) => changeIcon(index, e)}
                          style={{
                            width: "180px",
                            height: "40px",
                            position: "absolute",
                            zIndex: 100,
                            marginLeft: "10px",
                          }}
                        >
                          {iconOptions.map((option) => (
                            <Option key={option.key}>{option.text}</Option>
                          ))}
                        </Select>
                      )}
                    </>
                  )}
                  {/*图标*/}
                </div>
              </div>
            </li>

            {/*其他隐藏起来的元素*/}
            <div
              style={{
                display: "flex",
                alignContent: "center",
              }}
            >
              {hoverIndex === index && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      display: "flex",
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
                          : culculateBackgroundColor(todos[index].color),
                        color: todo.completed ? "gray" : todos[index].color,
                      }}
                      onClick={() => handleCompleteTodo(index)}
                    >
                      {todo.completed ? (
                        <FontAwesomeIcon icon={faHistory} />
                      ) : (
                        <FontAwesomeIcon icon={faCheck} />
                      )}
                    </Button>

                    <Button
                      className="fadeIn"
                      style={{
                        marginLeft: "15px",
                        border: `1px solid ${
                          todo.completed ? "gray" : todos[index].color
                        }`,
                        background: todo.completed
                          ? "rgba(211,211,211,0.5)"
                          : culculateBackgroundColor(todos[index].color),
                        color: todo.completed ? "gray" : todos[index].color,
                      }}
                      onClick={() => handleDeleteTodo(index)}
                      Background-color={
                        todo.completed ? "gray" : todos[index].color
                      }
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>

                    <ColorPicker
                      className="fadeIn"
                      style={{
                        zIndex: 2,
                        marginLeft: "15px",
                      }}
                      presets={colorpreset}
                      defaultValue={todos[index].color}
                      onChangeComplete={(e) => changeColor(index, e)}
                    />
                  </div>
                  <p
                    className="fadeIn"
                    style={{
                      fontSize: "10px",
                      color: todo.completed ? "gray" : todo.color,
                    }}
                  >
                    这条Todo添加于{new Date(todo.timestamp).toLocaleString()}
                  </p>
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

export default Todo;
