import { useEffect, useState } from "react";
import "./Todo.css";
import "../index.css";
import { IDropdownOption } from "@fluentui/react";
import { Divider } from "@fluentui/react-components";
import { Button } from "antd";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { CombinedInput } from "./Components/CombinedInput";
import { TodoManager } from "./Todo";
import { TodoGroupRenderer } from "./Components/TodoGroupRenderer";
import { todoEventBus } from "./Todo";

export const Todo = () => {
  const manager = new TodoManager();
  const iconOptions: IDropdownOption[] = Object.keys(fas).map((iconName) => ({
    key: iconName,
    text: iconName,
  }));
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = todoEventBus.subscribe(`todoManager-update`, () => {
      forceUpdate({});
    });

    return () => unsubscribe();
  }, [manager.Todos]);

  iconOptions.unshift({ key: "", text: "无（请选择图标）" });

  return (
    <div className="Todo flex flex-row p-3.5 items-start max-w-[100%]">
      {/* 主界面 */}
      <div
        className="z-100 w-100 mr-2.5 top-0 bg-white"
      >
        <div className="mt-4 flex-col">
          <CombinedInput
            exportData={(data) => {
              manager.addTodo(data);
            }}
          />
          <div>
            <Button onClick={() => manager.undoDeleteTodo()}>撤销删除</Button>
            <Button
              onClick={() => manager.undoDeleteSubtask()}
              style={{ marginLeft: "10px" }}
            >
              撤销删除子任务
            </Button>
            <Button
              onClick={() => manager.saveTodoToFile()}
              style={{ marginLeft: "10px" }}
            >
              保存Todo
            </Button>
          </div>
          <Divider className="mt-2" />
        </div>
      </div>

      {/* 待办事项列表 */}
      <div className="TodoMain flex">
        
        {manager.Todos.map((todo, index) => (
          <TodoGroupRenderer key={`todoitem-${index}`} todo={todo} />
        ))}
      </div>
    </div>
  );
};
