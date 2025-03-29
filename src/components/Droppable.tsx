import { Camera } from "@/types/Camera";
import { Droppable } from "react-beautiful-dnd";

export const DroppableArea = ({ cameras }: { cameras: Camera[] }) => {
  return (
    <Droppable droppableId="selected-cameras">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-amber-400 p-4 rounded-md"
        >
          <h2>Adicione aqui as câmeras</h2>
          {cameras.map((item) => (
            <div key={item.id} className="bg-white p-2 mt-2 rounded shadow">
              {item.keyword}
            </div>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};


{/* {cameras.map((item, index) => (
            <div key={item.id} className="bg-white p-2 mt-2 rounded shadow">
              {item.keyword}
            </div>
          ))} */}