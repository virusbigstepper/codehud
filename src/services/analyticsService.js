import TaskService from './taskService.js';
import CodeTrackerService from './codeTrackerService.js';
import PlatformAnalyzerService from './platformAnalyzerService.js';

class AnalyticsService {

    constructor() {

        this.platformStats = null;

    }

    getDashboardStats() {

        const taskStats = TaskService.getStats();
        const codeStats = CodeTrackerService.getStats();

        const totalProblems = this.platformStats
            ? (this.platformStats.codeforcesSolved || 0) +
              (this.platformStats.leetcodeSolved || 0) +
              (this.platformStats.gfgSolved || 0)
            : 0;

        return {

            totalProblems,

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

    async loadPlatformStats() {

        try {

            this.platformStats =
                await PlatformAnalyzerService.getStats();

        } catch (e) {

            this.platformStats = null;

        }

        return this.platformStats;

    }

}

export default new AnalyticsService();
