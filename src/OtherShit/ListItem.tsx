import {Card} from "antd";

const ListItem = ({item, provided}: any) => {
    return <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
    >
        <Card style={{margin: 20}}>
            <p>{item.content}</p>
        </Card>
    </div>
}

export default ListItem