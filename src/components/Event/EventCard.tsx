import { useNavigate } from "react-router-dom";
import EventBadge from "./EventBadge";
import getBadges from "../../lib/getBadges";
import type { EventRecord } from "../../lib/Database/Records/EventRecord";

export default function EventCard({ event }: { event: EventRecord }) {
    const nav = useNavigate();

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
                { getBadges(event).map((t, i) => <EventBadge text={t} key={i} />) }
            </div>
        </div>
        <div className="p-6 text-gray-800 leading-relaxed text-sm md:text-base">
            { event.description }
        </div>
        {
            (event.requires_signup && event.signup_link) && <p className="pb-4 text-center text-gray-800 font-semibold">Click here to sign up!</p>
        }
        {
            (event.requires_signup && !event.signup_link) && <p className="pb-4 text-center text-gray-800 font-semibold">Signup not currently available.</p>
        }
        {
            !event.requires_signup && <p className="pb-4 text-center text-gray-800 font-semibold">No signup required.</p>
        }
    </div>
}