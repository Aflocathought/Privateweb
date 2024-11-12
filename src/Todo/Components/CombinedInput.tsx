import { TodoItem } from "../TodoUpdate copy";
import "../Todo.css";
import "../../index.css";
import { Option, Textarea } from "@fluentui/react-components";
import { Select,  Button } from "antd";
import { MyCalendar } from "../../Components/Base/MyCalendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { calculateBackgroundColor } from "../TodoFunction";
import { IDropdownOption } from "@fluentui/react";
import { MyColorPicker } from "../../Components/Base/ColorPicker/MyColorPicker";

interface CombinedInputProps {
  exportData: (data: TodoItem) => void;
}

export const CombinedInput: React.FC<CombinedInputProps> = ({ exportData }) => {
  const [input, setInput] = useState<string>("");
  const [colorInput, setColorInput] = useState<string>("#000000");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [dateTime, setDateTime] = useState<Date | number>(0);
  const [showPicker, setShowPicker] = useState(false);
  const [typing, setTyping] = useState(false);
  const packingData = (e: React.FormEvent) => {
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
      exportData(newTodo);
    }
  };

  const iconOptions: IDropdownOption[] = Object.keys(fas).map((iconName) => ({
    key: iconName,
    text: iconName,
  }));
  iconOptions.unshift({ key: "", text: "无（请选择图标）" });
  return (
    <div className="mt-4">
      <form
        onSubmit={packingData}
        onKeyDown={(event) => {
          if (event.ctrlKey && event.key === "Enter") {
            packingData(event);
          }
        }}
      >
        <div className="flex">
          <Textarea
            className="TodoInputtask"
            onCompositionStart={() => setTyping(true)}
            onCompositionEnd={() => setTyping(false)}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="今天要做什么……"
          />
          <Button
            onClick={packingData}
            className="ml-2"
            style={{ width: "120px", height: "60px" }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
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
                      noSetDate={(value) => setDateTime(value)}
                      onSelect={(date) => setDateTime(date.toDate())}
                    ></MyCalendar>
                  </div>
                </>
              )}
            </div>
            
            <MyColorPicker
              color={colorInput}
              onSelect={(color) => setColorInput(color)}
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
        </div>
      </form>
    </div>
  );
};
