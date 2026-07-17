import { Notification } from "electron";

class NotificationManager {

    constructor() {

        this.enabled = true;

    }

    send(title, body, options = {}) {

        if (!this.enabled) return;
        if (!Notification.isSupported()) return;

        const notification = new Notification({

            title,
            body,
            silent: options.silent || false,
            icon: options.icon || undefined

        });

        notification.show();

        return notification;

    }

    streakMilestone(days) {

        this.send(
            "🔥 Streak Milestone!",
            `You've been coding for ${days} days straight. Keep it up!`
        );

    }

    taskReminder(taskTitle) {

        this.send(
            "📋 Task Reminder",
            `Don't forget: ${taskTitle}`
        );

    }

    sessionSummary(minutes, filesChanged) {

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const timeStr = hours > 0
            ? `${hours}h ${mins}m`
            : `${mins}m`;

        this.send(
            "⏱ Coding Session",
            `You coded for ${timeStr} and changed ${filesChanged} files today.`
        );

    }

    ratingChange(platform, oldRating, newRating) {

        const diff = newRating - oldRating;
        const emoji = diff > 0 ? "📈" : "📉";
        const sign = diff > 0 ? "+" : "";

        this.send(
            `${emoji} ${platform} Rating Update`,
            `Your rating changed: ${oldRating} → ${newRating} (${sign}${diff})`
        );

    }

    setEnabled(enabled) {

        this.enabled = enabled;

    }

}

export default new NotificationManager();
