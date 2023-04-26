import { ActivityType, Client } from "discord.js";
import { getProgress } from "./webui/api";
import QueueManager from "./webui/generate/queue";

const setPresence = async (client: Client, str: string) => {
    client.user.setPresence({
        status: "online",
        afk: false,
        activities: [
            {
                name: str,
                type: ActivityType.Playing
            }
        ]
    });
};

const applyPresence = (client: Client) => {
    let current = "";

    setInterval(async () => {
        try {
            const progress = await getProgress();

            let str = "";

            if (progress.progress == 0) {
                str = "Queue Empty.";
            } else {
                const percent = Math.floor(progress.progress * 100);

                const queue = QueueManager.instance.getCurrentQueue();
                if (queue) {
                    str = `Current progress (${queue.id}): ${percent}%`;
                } else {
                    str = `Current progress: ${percent}%`;
                }
            }

            if (current != str) {
                await setPresence(client, str);
                current = str;
            }
        } catch (e) {
            try {
                await setPresence(client, "Queue empty.");
                current = "Queue empty.";
            } catch (ee) {
                // ignore error
            }
        }
    }, 1000 * 5);
};

export default applyPresence;
