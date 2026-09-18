import { CookingEvent } from "../../lib/CookingEvent";

export default function calculateEventMap(events: CookingEvent[]) {
     // Format data base information into a Map of day -> event[]
     const info = new Map<string, CookingEvent[]>();
     for (const event of events) {
	const startTime = event.getStartDate();
	const startDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
	const dateString = `${startDate.getMonth()}/${startDate.getDate()}`;

	if (info.has(dateString)) {
	    info.get(dateString)?.push(event);
	} else {
	    info.set(dateString, [event]);
	}
     }

     return info;
}
