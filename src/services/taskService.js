import StorageService from './storageService.js';

const storage = new StorageService();

class TaskService {
    constructor(storageService) {
        this.storage = storageService;
        this.tasks = this.storage.loadData("tasks") || [];
    }

    addTask(task){
        this.tasks.push(task);
        this.saveTasks();
    }

    removeTask(id){
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }

    getTasks(){
        return this.tasks;
    }

    saveTasks(){
        this.storage.saveData("tasks", this.tasks);
    }
    
    toggleTaskCompletion(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
        }
    }

    getStats() {
        const tasks = this.getTasks();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
            task => task.completed
        ).length;

        const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        return {
            totalTasks,
            completedTasks,
            completionPercentage
        };
    }
}


export default new TaskService(storage);