import type { EventWrapper } from "./Database/Records/EventRecord";

export default function getBadges(event: EventWrapper) {
    const badges: string[] = [];
    const startDate = new Date(event.getStartDate());
    const endDate = new Date(event.getEndDate());

    badges.push(startDate.toLocaleDateString('en-us', {
        weekday: "short",
        day: 'numeric',
        month: 'long'
    }));
    badges.push(startDate.toLocaleTimeString('en-us', {
        hour: "numeric"
    }) + " - " + endDate.toLocaleTimeString('en-us', {
        hour: "numeric"
    }));
    
    badges.push(event.location);

    switch (event.accessability) {
        case "AllStudents":
            badges.push("All Students");
            break;
        case "ClubMembers":
            badges.push("Club Members");
            break;
    }

    if (event.requires_signup) badges.push("Signup Required");

    return badges;
}