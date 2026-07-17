import { useState, useEffect } from "react";
import { FiPlus, FiCalendar } from "react-icons/fi";
import "./TaskWidget.css";
import taskService from "../../services/taskService";
import { FiTrash2 } from "react-icons/fi";

const TaskWidget = () => {

    const [tasks, setTasks] = useState([]);

    const [input, setInput] = useState("");

    const [priority, setPriority] = useState("Low");

    useEffect(() => {

        const loadTasks = async () => {

            await taskService.initialize();

            setTasks(taskService.getTasks());

        };

        loadTasks();

    }, []);

    const refreshTasks = () => {

        setTasks([
            ...taskService.getTasks()
        ]);

    };

    const handleAddTask = () => {

        if (!input.trim()) return;

        taskService.addTask({

            id: crypto.randomUUID(),

            title: input.trim(),

            priority,

            completed: false,

            dueDate: "Today"

        });

        refreshTasks();

        setInput("");

    };

    const handleToggleTask = (id) => {

        taskService.toggleTaskCompletion(id);

        refreshTasks();

    };

    const handleRemoveTask = (id) => {

        taskService.removeTask(id);

        refreshTasks();

    };

    return (

        <div className="task-widget">
        


            <div className="task-header">

                <h2>

                    Tasks

                </h2>

                <button className="task-add-icon" 
                    onClick={() => handleAddTask()}
                >

                    <FiPlus />

                </button>

            </div>


            <div className="tasks-container">

                {

                    tasks.map((task, index) => (

                        <div
                            key={task.id}
                            className="task-card"
                        >

                            <div
                                className={`priority-strip priority-${task.priority.toLowerCase()}`}
                            ></div>

                            <div className="task-main">

                                <div className="task-top">

                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() =>
                                            handleToggleTask(task.id)
                                        }
                                    />

                                    <h3
                                        className={`
                                            task-title
                                            priority-${task.priority.toLowerCase()}
                                            ${task.completed ? "task-completed" : ""}
                                        `}
                                    >

                                        {task.title}

                                    </h3>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleRemoveTask(task.id)}
                                    >
                                        <FiTrash2 />
                                    </button>

                                </div>

                                <div className="task-meta">

                                    <span
                                        className={`
                                            priority-badge
                                            priority-${task.priority.toLowerCase()}
                                        `}
                                    >

                                        {task.priority}

                                    </span>

                                    <span className="due-date">

                                        <FiCalendar />

                                        {task.dueDate}

                                    </span>

                                </div>

                            </div>

                            {

                                index !== tasks.length - 1 &&

                                <div className="task-divider"></div>

                            }

                        </div>

                    ))

                }

            </div>


            <div className="controls">

                <input

                    className="task-input"

                    placeholder="Enter new task"

                    value={input}

                    onChange={(e) =>
                        setInput(e.target.value)
                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            handleAddTask();

                        }

                    }}

                />

                <select

                    className="priority-select"

                    value={priority}

                    onChange={(e) =>
                        setPriority(e.target.value)
                    }

                >

                    <option>

                        Low

                    </option>

                    <option>

                        Medium

                    </option>

                    <option>

                        High

                    </option>

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
