import { useNavigate } from "react-router-dom";
import EventBadge from "./EventBadge";
import getBadges from "../../lib/getBadges";
import type { EventWrapper } from "../../lib/Database/Records/EventRecord";
import AllergyBadge from "./AllergyBadge";

export default function EventCard({ event }: { event: EventWrapper }) {
    const nav = useNavigate();
    return <div className="flex flex-col bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 w-full max-w-3xl cursor-pointer" onClick={() => {nav(`/events/${event.id}`)}}>
        <div className={"flex flex-col items-center p-2 gap-1"} style={{
            backgroundImage: `url(${event.background_image})`,
            backgroundPosition: "center",
            backgroundSize: "cover"
        }}>
            <div className="mb-40 md:mb-60 p-2 rounded-xl bg-white shadow-sm">
                <span className={"font-bold text-2xl text-black"}>{ event.name }</span>
            </div>
            <div className="flex flex-wrap gap-2">
                { getBadges(event).map((t, i) => <EventBadge text={t} key={i} />) }
            </div>
            <div className="w-full flex justify-start md:justify-center">
                <AllergyBadge event={event} />
            </div>
        </div>
        <div className="py-2 px-6 text-gray-800 leading-relaxed text-sm md:text-base">
            <p className="whitespace-pre-wrap">{ event.description }</p>
            { event.notable_link && 
                <p>More information here: <a className="text-blue-600 underline" href={event.notable_link}>{event.notable_link}</a></p>
            }
        </div>
        {
            (event.requires_signup) && <p className="px-4 py-2 text-center text-gray-800 font-semibold">Click here to sign up!</p>
        }
        {
            !event.requires_signup && <p className="px-4 py-2 text-center text-gray-800 font-semibold">No signup required.</p>
        }
    </div>
}