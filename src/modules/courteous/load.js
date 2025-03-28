import { scheduleShow } from "./show.js";

export async function courteous() {
  const date = selectedDate.value;

  const dailySchedules = await scheduleFetchByDay({ date });

  scheduleShow({ dailySchedules });

  hoursLoad({ date, dailySchedules });
}
