import { useNavigate } from "react-router-dom";
import type CookingEvent from "../../lib/CookingEvent";
import EventBadge from "./Badges";
import { useEffect, useState } from "react";
import LoadingComponent from "../Utility/LoadingComponent";

function AllergySection({ event }: { event: CookingEvent }) {
    const [allergens, setAllergens] = useState<string[] | null>(null);

    useEffect(() => {
        event.getAllergens().then(a => setAllergens(a));
    }, [event]);

    if (!allergens) return <LoadingComponent />


     return <div className="bg-amber-300 p-2 rounded-xl shadow-sm">
        <span className="font-semibold">May contain: {
            allergens
            .sort()
            .map((s, i) => 
                (i === 0 && s[0].toUpperCase() + s.slice(1).toLowerCase())
                || ( i !== allergens.length - 1 && s.toLowerCase())
                || ` and ${s.toLowerCase()}`
            ).join(", ")
        }</span>
    </div>
}

export default function EventCard({ event }: { event: CookingEvent }) {
    const nav = useNavigate();
    return <div className="flex flex-col bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 w-full max-w-3xl cursor-pointer" onClick={() => {nav(`/events/${event.id}`)}}>
        <div className={"flex flex-col items-center p-2 gap-1"} style={{
            backgroundImage: `url(${event.backgroundImageUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover"
        }}>
            <div className="mb-40 md:mb-60 p-2 rounded-xl bg-white shadow-sm">
                <span className={"font-bold text-2xl text-black"}>{ event.name }</span>
            </div>
            <div className="flex flex-wrap gap-2">
                { event.getBadges().map((t, i) => <EventBadge text={t} key={i} /> ) }
            </div>
            <AllergySection event={event} />
        </div>
        <div className="py-2 px-6 text-gray-800 leading-relaxed text-sm md:text-base">
            <p className="whitespace-pre-wrap">{ event.description }</p>
            { event.notableLink && 
                <p>More information here: <a target="_blank" className="text-blue-600 underline" href={event.notableLink}>{event.notableLink}</a></p>
            }
        </div>
        {
            (event.requiresSignup) && <p className="px-4 py-2 text-center text-gray-800 font-semibold">Click here to sign up!</p>
        }
        {
            !event.requiresSignup && <p className="px-4 py-2 text-center text-gray-800 font-semibold">No signup required.</p>
        }
    </div>
}