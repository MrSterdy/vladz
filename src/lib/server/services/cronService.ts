import schedule from "node-schedule";

import { clearExpired } from "$lib/server/services/timetableService";

export function scheduleJobs() {
    schedule.scheduleJob("0 0 * * *", () => clearExpired());
}
