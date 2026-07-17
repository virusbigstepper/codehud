import StorageService from "./storageService.js";

const storage = new StorageService();

class TaskService {

    constructor() {

        this.tasks = [];

    }

    async initialize(){
        this.tasks = await window
        .electronAPI
        .loadData("tasks.json") || [];
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

    }

    removeTask(id) {

        this.tasks = this.tasks.filter(

            task => task.id !== id

        );

        this.saveTasks();

    }

    toggleTaskCompletion(id) {

        const task = this.tasks.find(

            task => task.id === id

        );

        if (!task) return;

        task.completed = !task.completed;

        this.saveTasks();

    }

    getTasks() {

        return [...this.tasks];

    }

    saveTasks() {

        this.storage.saveData(

            "tasks",

            this.tasks

        );

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

}

export default new TaskService(storage);