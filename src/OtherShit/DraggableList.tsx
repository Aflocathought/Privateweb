import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ListItem from "./OtherShit/ListItem";
import { useState } from "react";

// 用来渲染列表的数据
export const DraggableList = () => {
  const [items, setItems] = useState([
    { id: "one", content: "一" },
    { id: "two", content: "二" },
    { id: "three", content: "三" },
    { id: "four", content: "四" },
  ]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // 如果没有目标位置，直接返回
    if (!destination) {
      return;
    }

    // 如果源位置和目标位置相同，直接返回
    if (source.index === destination.index) {
      return;
    }

    // 创建新的 items 数组
    const newItems = Array.from(items);

    // 移动项目
    const [removed] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removed);

    // 更新状态
    setItems(newItems);
  };

  // 这里就是拖拽组件了
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <ListItem provided={provided} item={item} />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default DraggableList;
