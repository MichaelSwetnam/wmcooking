import { useNavigate } from "react-router-dom";

import type { EventRecord } from "../lib/Database";
import EventBadge from "./EventBadge";

export default function EventCard({ event }: { event: EventRecord }) {
    const nav = useNavigate();
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

    return <div className="flex flex-col bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 w-full max-w-3xl cursor-pointer" onClick={() => {nav(`/events/${event.id}`)}}>
        <div className={"flex flex-col items-center p-5 gap-1"} style={{
            backgroundImage: `url(${event.background_image})`,
            backgroundPosition: "center",
            backgroundSize: "cover"
        }}>
            <div className="mb-60 p-2 rounded-xl bg-white shadow-sm">
                <span className={"font-bold text-2xl text-black"}>{ event.name }</span>
            </div>
            <div className="flex flex-wrap gap-2">
                { badges.map(t => <EventBadge text={t} />) }
            </div>
        </div>
        <div className="p-6 text-gray-800 leading-relaxed text-sm md:text-base">
            { event.description }
        </div>
    </div>
}