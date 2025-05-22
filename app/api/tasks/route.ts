import { NextResponse } from "next/server";

let tasks = [
 {
 id: '1',
 title: 'Complete project proposal',
 description: 'Draft the Q3 project proposal for client review',
 completed: false,
 createdAt: '2025-04-15'
 },
 {
 id: '2',
 title: 'Review pull requests',
 description: 'Review and merge team pull requests',
 completed: true,
 createdAt: '2025-04-14'
 }
];

export async function GET() {
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTask = {
    id: Date.now(),
    ...body,
    created_at: new Date().toISOString(),
  };
  tasks.push(newTask);
  return NextResponse.json({ task: newTask });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const taskIndex = tasks.findIndex((t) => t.id === body.id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...body };
    return NextResponse.json({ task: tasks[taskIndex] });
  }
  return NextResponse.json({ error: "Task not found" }, { status: 404 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  tasks = tasks.filter((task) => task.id !== id);
  return NextResponse.json({ success: true });
}
