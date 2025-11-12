import { useParams } from "react-router-dom";
import ErrorComponent from "../components/Event/ErrorComponent";
import EventBadge from "../components/Event/EventBadge";

import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Database, { type EventRecord } from "../lib/Database";
import LoadingComponent from "../components/Utility/LoadingComponent";
import getBadges from "../lib/getBadges";

function Success({ id }: { id: number }) {
    const [event, setEvent] = useState<EventRecord | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);

    useEffect(() => {
        const getData = async () => {
            const { data, error } = await Database.getEvent(id);

            setError(error);
            setEvent(data);
        }
        getData();
    }, [id])


    if (error) {
        return <ErrorComponent message="Could not find this event" technical={`Database: ${error.code} - ${error.message}`}/>
    }

    if (event === null) {
        return <LoadingComponent />
    }

    return <div className="flex-1 flex flex-col justify-start items-center gap-2 h-full">
        <h2 className="pt-5 text-3xl md:text-4xl font-extrabold text-orange-700 text-center">Event Details:</h2>
        <div className="flex-1 flex flex-col bg-white rounded-3xl overflow-hidden w-full">
            <div className={"flex flex-col items-center p-5 gap-1"} style={{
                backgroundImage: `url(${event.background_image})`,
                backgroundPosition: "center",
                backgroundSize: "cover"
            }}>
                <div className="mb-60 p-2 rounded-xl bg-white shadow-sm">
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
        </div>
    </div>;
}

export default function EventPage() {
    const { id } = useParams();
    if (!id) {
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router. Given: '${id}'`} />
    }
    
    const  parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router with type number. Given: '${id}' which is NaN.`} />
    }
    
    return <Success id={parsedId}/> 
}