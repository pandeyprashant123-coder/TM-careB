import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TaskData } from "../page";
import { toast, ToastContainer } from "react-toastify";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { MdOutlineDeleteOutline } from "react-icons/md";
import axios from "axios";

const SideNav = ({
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
  const [inputEnable, setInputEnable] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (taskDatas) {
      setInputEnable((prev) => {
        const newState = { ...prev };
        taskDatas.forEach((task) => {
          if (newState[task.id] === undefined) {
            newState[task.id] = false;
          }
        });
        return newState;
      });
    }
  }, [taskDatas]);

  const addNewTask = async () => {
    const tempId = Date.now();
    const newTask: TaskData = {
      id: tempId,
      title: "",
      description: "",
      completed: false,
      created_at: new Date().toISOString(),
    };
    setTaskDatas((prev) => (prev ? [...prev, newTask] : [newTask]));
    setTask(newTask);

    try {
      const res = await axios.post("/api/tasks", {
        title: "",
        description: "",
        completed: false,
      });

      const realTask = res.data.task;

      setTaskDatas((prev) =>
        prev ? prev.map((t) => (t.id === tempId ? realTask : t)) : [realTask]
      );
      setTask(realTask);

      toast("New task created");
    } catch (error) {
      console.error("Failed to create task", error);
      toast.error("Failed to create task");
    }
  };

  const deleteTask = async (taskId: number) => {
    setTaskDatas((prevTasks) => {
      const updatedTasks = prevTasks?.filter((t) => t.id !== taskId) || [];
      if (task.id === taskId) {
        setTask(
          updatedTasks[0] || {
            id: 0,
            title: "",
            description: "",
            completed: false,
            created_at: "",
          }
        );
      }
      return updatedTasks;
    });

    try {
      await axios.delete(`/api/tasks/${taskId}`);
      toast("Task Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleTaskClick = (taskItem: TaskData) => {
    setTask(taskItem);
  };

  const updateTaskTitle = (taskId: number, newTitle: string) => {
    setTaskDatas((prevTasks) =>
      prevTasks
        ? prevTasks.map((taskItem) =>
            taskItem.id === taskId ? { ...taskItem, title: newTitle } : taskItem
          )
        : []
    );

    if (task.id === taskId) {
      setTask((prev) => ({ ...prev, title: newTitle }));
    }
  };

  const updateTaskCompleted = (taskId: number, completed: boolean) => {
    setTaskDatas((prevTasks) =>
      prevTasks
        ? prevTasks.map((taskItem) =>
            taskItem.id === taskId ? { ...taskItem, completed } : taskItem
          )
        : []
    );

    if (task.id === taskId) {
      setTask((prev) => ({ ...prev, completed }));
    }
  };

  return (
    <div className="h-screen fixed z-50 lg:sticky top-0 transition-all duration-300 ease-in-out lg:w-1/5">
      <ToastContainer />
      <div className="z-50 h-16 sticky top-0 flex gap-3 justify-between items-center bg-white p-2 border-b text-gray-800 font-semibold">
        <div className="flex gap-2 items-center">
          <FaRegUserCircle className="text-2xl" />
          <h1>Hello</h1>
        </div>
      </div>
      <div className="h-[91vh] overflow-y-auto bg-white flex flex-col px-6 py-3">
        <button
          className="bg-[#f4f5f9] text-sm p-2 font-semibold mx-3 rounded-xl flex justify-around items-center cursor-pointer"
          onClick={addNewTask}
        >
          <h1>New Task</h1>
          <FaCirclePlus className="text-3xl text-green-600" />
        </button>
        <ul className="p-4 flex flex-col gap-3">
          {taskDatas &&
            taskDatas.map((taskItem) => (
              <li key={taskItem.id}>
                <div
                  className={`flex justify-between hover:bg-gray-200 items-center py-1 px-3 rounded-2xl cursor-pointer ${
                    task.id === taskItem.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleTaskClick(taskItem)}
                >
                  <input
                    type="checkbox"
                    checked={taskItem.completed}
                    onChange={(e) =>
                      updateTaskCompleted(taskItem.id, e.target.checked)
                    }
                    className="cursor-pointer"
                  />
                  <input
                    type="text"
                    value={taskItem.title}
                    placeholder="Add title.."
                    className="m-2 font-semibold w-24 focus:outline-none bg-transparent"
                    disabled={!inputEnable[taskItem.id]}
                    onChange={(e) =>
                      updateTaskTitle(taskItem.id, e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={() =>
                      setInputEnable((prev) => ({
                        ...prev,
                        [taskItem.id]: true,
                      }))
                    }
                    onBlur={() =>
                      setInputEnable((prev) => ({
                        ...prev,
                        [taskItem.id]: false,
                      }))
                    }
                  />
                  <MdOutlineDeleteOutline
                    className="hover:text-red-400 text-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(taskItem.id);
                    }}
                  />
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
