import React, { useState } from "react";
import "./TaskWidget.css";
import taskService from "../../services/taskService";


const TaskWidget = () => {

    const [tasks, setTasks] = useState(taskService.getTasks());

    const [input, setInput] = useState("");

    const handleAddTask = () => {

        if (!input.trim()) return;

        const newTask = {
            id: crypto.randomUUID(),
            title: input.trim(),
            priority,
            completed: false
        };

        taskService.addTask(newTask);

        setTasks([...taskService.getTasks()]);

        setInput("");
    };

    const [priority, setPriority] = useState("low");    

    const handleRemoveTask = (id) => {

        taskService.removeTask(id);

        setTasks([...taskService.getTasks()]);
    };

    const handleToggleTask = (id) => {

        taskService.toggleTaskCompletion(id);
        setTasks([...taskService.getTasks()]);
    };

    return (
    <div className="task-widget">

        <div className="tasks-container">

            {tasks.map((task) => (
                <div className="task-row" key={task.id}>

            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
            />

            <span
                className={`task-title priority-${task.priority.toLowerCase()}
                    ${task.completed ? "task-completed" : ""}`}
            >
                {task.title}
            </span>

            <button
                className="delete-btn"
                onClick={() => handleRemoveTask(task.id)}
            >
                ✕
            </button>

        </div>
            ))}

        </div>

        <div className="controls">

            <input
                className="task-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleAddTask();
                    }
                }}
                placeholder="enter new task"
            />

            <select
                className="priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <button
                className="add-button"
                onClick={handleAddTask}
            >
                + Add
            </button>

        </div>

    </div>
);
};

export default TaskWidget;