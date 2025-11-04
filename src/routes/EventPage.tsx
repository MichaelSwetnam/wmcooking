import { useParams } from "react-router-dom";
import ErrorComponent from "../components/ErrorCompnent";
import Cookies from "../assets/cookies.jpeg";
import EventBadge from "../components/EventBadge";

import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Database from "../lib/Database";
import LoadingComponent from "../components/LoadingComponent";

function Success({ id }: { id: number }) {
    const [event, setEvent] = useState<{
        accessability: "AllStudents" | "ClubMembers";
        description: string;
        end: string;
        id: number;
        location: string;
        name: string;
        start: string;
    } | null>(null);
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

    return <div className="flex-1 flex flex-col justify-start items-center gap-2 h-full">
        <h2 className="pt-5 text-3xl md:text-4xl font-extrabold text-orange-700 text-center">Event Details:</h2>
        <div className="flex-1 flex flex-col bg-white rounded-3xl overflow-hidden w-full">
            <div className={"flex flex-col items-center p-5 gap-1"} style={{
                backgroundImage: `url(${Cookies})`,
                backgroundPosition: "center",
                backgroundSize: "cover"
            }}>
                <div className="mb-60 p-2 rounded-xl bg-white shadow-sm">
                    <span className={"font-bold text-2xl"} style={{ color: "black" }}>{event.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    { badges.map((t, i) => <EventBadge key={i} text={t} />) }
                </div>
            </div>
            <p className="p-6 text-gray-800 leading-relaxed text-sm md:text-base">{event.description}</p>
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