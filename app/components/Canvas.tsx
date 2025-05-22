import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TaskData } from "../page";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const Canvas = ({
  task,
  setTask,
  taskDatas,
  setTaskDatas,
}: {
  task: TaskData;
  setTask: Dispatch<SetStateAction<TaskData>>;
  taskDatas: TaskData[] | undefined;
  setTaskDatas: Dispatch<SetStateAction<TaskData[]>>;
}) => {
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEdited) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEdited]);

  if (!taskDatas || taskDatas.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-xl">
        Welcome! to Task Manager
      </div>
    );
  }

  const updateTaskTitle = (newTitle: string) => {
  setTask((prev) => {
    const updated = { ...prev, title: newTitle };
    setTaskDatas((prevTasks) =>
      prevTasks.map((t) => (t.id === updated.id ? updated : t))
    );
    return updated;
  });
  setIsEdited(true);
};

const updateTaskBody = (newBody: string) => {
  setTask((prev) => {
    const updated = { ...prev, description: newBody };
    setTaskDatas((prevTasks) =>
      prevTasks.map((t) => (t.id === updated.id ? updated : t))
    );
    return updated;
  });
  setIsEdited(true);
};


  const handleSave = async () => {
  try {
    const res = await axios.patch("/api/tasks", task);
    toast("Task Updated");
    setIsEdited(false);
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
  }
};


  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 lg:p-6">
      <ToastContainer />
      <button
        type="button"
        disabled={!isEdited}
        className={`fixed bottom-20 right-20 flex items-center py-3 px-6 rounded-xl shadow-2xl gap-2 hover:cursor-pointer ${
          isEdited ? "bg-white text-green-500 hover:bg-green-50" : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        onClick={handleSave}
      >
        Save
      </button>
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={(e) => updateTaskTitle(e.target.value)}
        className="m-2 font-bold text-5xl text-gray-700 focus:outline-none"
        placeholder="Task Title"
      />
      <textarea
        name="description"
        value={task.description}
        onChange={(e) => updateTaskBody(e.target.value)}
        className="m-2 text-gray-600 focus:outline-none min-h-[200px] resize-none"
        placeholder="Write task details here..."
      />
    </form>
  );
};

export default Canvas;
