"use client";

import { useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import SideNav from "./components/SideNav";
import axios from "axios";

export interface TaskData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export default function Home() {
  const [task, setTask] = useState<TaskData>({
    id: 0,
    title: "",
    description: "",
    completed: false,
    created_at: "",
  });

  const [taskDatas, setTaskDatas] = useState<TaskData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/tasks");
        setTaskDatas(res.data.tasks);
        if (res.data.tasks.length > 0) {
          setTask(res.data.tasks[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex">
      <SideNav
        task={task}
        setTask={setTask}
        taskDatas={taskDatas}
        setTaskDatas={setTaskDatas}
      />
      <div className="relative py-10 pl-20 lg:px-20 w-4/5">
        <Canvas
          task={task}
          setTask={setTask}
          taskDatas={taskDatas}
          setTaskDatas={setTaskDatas}
        />
      </div>
    </main>
  );
}
