import type { EventRecord } from "../../lib/Database/EventRecord";
import getBadges from "../../lib/getBadges";
import EventBadge from "./EventBadge";

export default function EventPage({ event }: { event: EventRecord }) {
    return <div className="flex flex-col bg-white rounded-3xl overflow-hidden w-full">
        <div className={"flex flex-col items-center p-5 gap-1 h-[40vh]"} style={{
            backgroundImage: `url(${event.background_image})`,
            backgroundPosition: "center",
            backgroundSize: "cover"
        }}>
            <div className="p-2 rounded-xl bg-white shadow-sm">
                <span className={"font-bold text-2xl text-black"}>{event.name}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                { getBadges(event).map((t, i) => <EventBadge key={i} text={t} />) }
            </div>
        </div>
        <div className="flex flex-col gap-3 px-6 p-3">
            <div>
                <p className="text-gray-800 font-semibold">Description:</p>
                <p className="text-gray-800 leading-relaxed text-sm md:text-base">{event.description}</p>
            </div>
            { event.signup_link && 
                <div>
                    <p className="text-gray-800 font-semibold">Signup Link:</p>
                    <a href={event.signup_link} target="_blank" className="text-blue-800 underline hover:text-blue-600 transition duration-200 cursor-pointer">{event.signup_link}</a>
                </div>
            }
            { 
                !event.signup_link && event.requires_signup && <p className="text-gray-800 font-semibold">Signup link is not currently available.</p>
            }
        </div>
    </div>;
}
