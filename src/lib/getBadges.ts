import type { EventRecord } from "./Database";

export default function getBadges(event: EventRecord) {
    const badges: string[] = [];
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

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