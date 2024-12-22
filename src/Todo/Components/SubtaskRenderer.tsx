import { Subtask } from "../Todo";
import { Checkbox } from "antd";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
interface SubtaskRendererProps {
  subtask: Subtask;
  hoverM: boolean;
}

export const SubtaskRenderer: React.FC<SubtaskRendererProps> = ({
  subtask,
  hoverM,
}) => {
  const [isEditingSubtask, setIsEditingSubtask] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <div
      className="todoSubtasks"
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <div className="flex content-center items-center">
        <Checkbox
          checked={subtask.completed}
          onChange={(e) => {
            subtask.complete(e.target.checked);
          }}
          style={{
            color: subtask.manager?.color,
          }}
        />

        <div className="flex flex-col">
          {hoverM && hover && isEditingSubtask ? (
            <textarea
              className="ccontentinstask"
              value={subtask.text}
              onChange={(e) => subtask.changeContent(e)}
              onBlur={() => {
                setIsEditingSubtask(false);
              }}
              autoFocus
            />
          ) : (
            <div
              className={`text-[15px] ml-2.5 ${
                subtask.completed ? "line-through" : ""
              }`}
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

      <FontAwesomeIcon
        icon={faTrash}
        style={{
          marginLeft: "10px",
          opacity: hoverM && hover ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
        onClick={() => subtask.manager?.deleteSubtask(subtask.ID)}
      />
    </div>
  );
};
