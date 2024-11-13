import React, { useState, useEffect } from "react";
import "./App.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    // Fetch tasks from the server on component mount
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const task = { task: newTask, status: "Pending" };

      fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })
        .then((res) => res.json())
        .then((savedTask) => {
          setTasks([...tasks, savedTask]); // Update tasks with the new task
          setNewTask(""); // Clear input
        })
        .catch((err) => console.error(err));
    }
  };

  const markAsCompleted = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
    })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, status: "Completed" } : task
          )
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="task-manager">
      <h2>Task Manager</h2>
      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <h3>Tasks:</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span
              className={
                task.status === "Completed" ? "completed-task" : "pending-task"
              }
            >
              {task.task} - {task.status}
            </span>
            {task.status === "Pending" && (
              <button className="markCompleted" onClick={() => markAsCompleted(task.id)}>
                Mark as Completed
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
