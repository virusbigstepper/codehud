class TaskService {

    constructor() {

        this.tasks = [];

        this.listeners = [];

    }

    isElectron() {

        return window.electronAPI !== undefined;

    }

    async initialize() {

        if (this.isElectron()) {

            const data = await window
                .electronAPI
                .load("tasks.json");

            this.tasks = data || [];

        } else {

            const raw = localStorage.getItem("tasks.json");

            this.tasks = raw ? JSON.parse(raw) : [];

        }

        this.migrateTasks();

    }

    migrateTasks() {

        let updated = false;

        this.tasks = this.tasks.map(task => {

            if (!task.createdAt) {

                task.createdAt = Date.now();

                updated = true;

            }

            if (!task.dueDate) {

                task.dueDate = "Today";

                updated = true;

            }

            return task;

        });

        if (updated) {

            this.saveTasks();

        }

    }

    addTask(task) {

        this.tasks.unshift({

            id: task.id,

            title: task.title,

            priority: task.priority,

            completed: false,

            createdAt: Date.now(),

            dueDate: task.dueDate || "Today"

        });

        this.saveTasks();

        this.notifyListeners();

    }

    removeTask(id) {

        this.tasks = this.tasks.filter(

            task => task.id !== id

        );

        this.saveTasks();

        this.notifyListeners();

    }

    toggleTaskCompletion(id) {

        const task = this.tasks.find(

            task => task.id === id

        );

        if (!task) return;

        task.completed = !task.completed;

        this.saveTasks();

        this.notifyListeners();

    }

    getTasks() {

        return [...this.tasks];

    }

    saveTasks() {

        if (this.isElectron()) {

            window.electronAPI.save(

                "tasks.json",

                this.tasks

            );

        } else {

            localStorage.setItem(

                "tasks.json",

                JSON.stringify(this.tasks)

            );

        }

    }

    getStats() {

        const totalTasks =

            this.tasks.length;

        const completedTasks =

            this.tasks.filter(

                task => task.completed

            ).length;

        const completionPercentage =

            totalTasks === 0

                ? 0

                : Math.round(

                    (completedTasks / totalTasks) * 100

                );

        return {

            totalTasks,

            completedTasks,

            completionPercentage

        };

    }

    subscribe(listener) {

        this.listeners.push(listener);

        return () => {

            this.listeners = this.listeners.filter(

                l => l !== listener

            );

        };

    }

    notifyListeners() {

        this.listeners.forEach(listener => listener());

    }

}

export default new TaskService();
