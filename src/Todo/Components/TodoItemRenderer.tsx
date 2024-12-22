import { TodoItem } from "../Todo";
import React, { useState, useEffect } from "react";
import { Icon } from "../Components/SelectableIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MyColorPicker } from "../../Components/ColorPicker/MyColorPicker";
import { Button } from "antd";
import { todoEventBus } from "../Todo";
import {
  faTrash,
  faPlus,
  faCheck,
  faHistory,
  faArrowDown,
  faArrowUp,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  calculateBackgroundColor2,
  UncompleteSubtaskNumber,
  getTodoColorStyle,
} from "../TodoFunction";
import { SubtaskRenderer } from "./SubtaskRenderer";

interface TodoItemRendererProps {
  todo: TodoItem;
}

export const TodoItemRenderer: React.FC<TodoItemRendererProps> = ({ todo }) => {
  const [, forceUpdate] = useState({});
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const unsubscribe = todoEventBus.subscribe(`todo-${todo.ID}-update`, () => {
      forceUpdate({});
    });

    return () => unsubscribe();
  }, [todo.ID]);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSubtask, setIsEditingSubtask] = useState(false);
  const [typing, setTyping] = useState(false);

  const [subInput, setSubInput] = useState("");

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

    setHover(false);
    setIsEditing(false);
  };

  const handleMouseLeaveinSubtask = (e: {
    screenX: number;
    screenY: number;
  }) => {
    if ((e.screenX === 0 && e.screenY === 0) || isEditingSubtask) {
      return;
    }

    setIsEditingSubtask(false);
  };

  return (
    <div
      className="todo"
      style={getTodoColorStyle(todo)}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={(e) => {
        handleMouseLeave(e);
      }}
    >
      <div
        className="flex flex-col text-[20px] w-[100%]"
        style={{
          color: todo.completed ? "gray" : todo.color,
        }}
      >
        <div
          className="flex justify-between text-[20px] w-[100%]"
          style={{
            color: todo.completed ? "gray" : todo.color,
          }}
        >
          <div className="flex flex-col text-[25px] font-bold w-[100%]">
            {/* 标题行 */}
            <div className="flex items-center justify-between w-[100%]">
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`mr-2 rotate-icon text-[30px] ${
                    todo.subtaskscollapsed ? "collapsed" : ""
                  }`}
                  onClick={() => todo.collapseSubtasks()}
                />
                {hover && isEditing ? (
                  <input
                    className="inputInSubtasks"
                    value={todo.text}
                    onChange={(e) => todo.changeTitle(e)}
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
                  className="font-normal text-[18px] flex items-center justify-center min-w-5 p-0.5 ml-2.5"
                  style={{
                    borderRadius: "30%",
                    backgroundColor: todo.completed
                      ? "rgba(211,211,211,0.5)"
                      : calculateBackgroundColor2(todo.color),
                  }}
                >
                  {UncompleteSubtaskNumber(todo.subtasks)}
                </div>
              </div>
              {/*图标*/}
              <div style={{ display: "flex" }}>
                <Icon
                  IconSelect={(value) => {
                    todo.changeIcon(value);
                  }}
                  onIconInput={todo.icon === "" ? "faPlus" : todo.icon}
                  show={todo.icon === "" ? hover : true}
                />
              </div>
              {/*图标*/}
            </div>
            {/* 标题行 */}
            {/*子任务呈现*/}
            <ul>
              <div
                style={{ display: "flex", flexDirection: "column" }}
                className={`subtaskcollapse ${
                  todo.subtaskscollapsed ? "collapsed" : ""
                }`}
                onMouseLeave={(e) => {
                  handleMouseLeaveinSubtask(e);
                }}
              >
                {(todo.subtasks || []).map((subtask, subindex) => (
                  <SubtaskRenderer
                    key={`todoitem-subtask-${subindex}`}
                    subtask={subtask}
                    hoverM={hover}
                  />
                ))}
              </div>
            </ul>
            {/*子任务呈现*/}
            {hover && (
              <div className="flex content-center mt-2">
                <Button
                  className="fadeIn"
                  style={getTodoColorStyle(todo)}
                  onClick={() => {
                    todo.addSubtask(subInput);
                  }}
                >
                  <div className="items-center flex">
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    <p>添加子任务</p>
                  </div>
                </Button>

                <div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      todo.addSubtask(subInput, event);
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

      {/*其他隐藏起来的元素*/}
      <div className="flex content-center">
        {hover && (
          <div
            className="flex justify-between"
            style={{
              color: todo.completed ? "gray" : todo.color,
            }}
          >
            <div className="flex flex-col">
              <div className="flex">
                <Button
                  className="fadeIn"
                  style={getTodoColorStyle(todo)}
                  onClick={() => todo.completeTodo()}
                >
                  <FontAwesomeIcon
                    icon={todo.completed ? faHistory : faCheck}
                  />
                </Button>

                <Button
                  className="fadeIn ml-3"
                  style={getTodoColorStyle(todo)}
                  onClick={() => todo.manager!.deleteTodo(todo.ID)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
                <MyColorPicker
                  color={todo.color}
                  onSelect={(color) => todo.changeColor(color)}
                />
              </div>
              <p className="fadeIn mt-1 text-[10px]">
                这条Todo添加于{new Date(todo.timestamp).toLocaleString()}
                {/* 最后更新于{new Date(todo.updatetime).toLocaleString()} */}
              </p>
            </div>
            <div className="flex">
              <Button
                className="fadeIn ml-5 "
                style={getTodoColorStyle(todo)}
                onClick={() => todo.manager?.moveToTop(todo.ID)}
              >
                <FontAwesomeIcon icon={faArrowUp} />
                <FontAwesomeIcon icon={faArrowUp} />
              </Button>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  className="fadeIn ml-3"
                  style={getTodoColorStyle(todo)}
                  onClick={() => todo.manager?.moveTodo(todo.ID, -1)}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </Button>
                <Button
                  className="fadeIn ml-3 mt-2 "
                  style={getTodoColorStyle(todo)}
                  onClick={() => todo.manager?.moveTodo(todo.ID, 1)}
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
  );
};
