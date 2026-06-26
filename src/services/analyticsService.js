import TaskService from './taskService.js';
import CodeTrackerService from './codeTrackerService.js';
import PlatformAnalyzerService from './platformAnalyzerService.js';

class AnalyticsService {

    getDashboardStats() {
        const taskStats = TaskService.getStats();
        const codeStats = CodeTrackerService.getStats();
        const platformStats = PlatformAnalyzerService.getStats();

        return {
            totalProblems:
                254,
            
            codingTime:
                codeStats.codingTime,
            
            filesChanged:
                codeStats.filesChanged,
            
            tasksCompleted:
                taskStats.completedTasks,

            totalTasks:
                taskStats.totalTasks,
            
            completionPercentage:
                taskStats.completionPercentage
        };
    }
}

export default new AnalyticsService();