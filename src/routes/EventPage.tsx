import { useParams } from "react-router-dom";
import ErrorComponent from "../components/ErrorCompnent";
import Cookies from "../assets/cookies.jpeg";
import EventBadge from "../components/EventBadge";

import { createClient, PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const PROJECT_URL = "https://okoywtixurlcfnkraeob.supabase.co";
const PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rb3l3dGl4dXJsY2Zua3JhZW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDExNjcsImV4cCI6MjA3Nzc3NzE2N30.Vtyh85w1_WYOjLeGbXNo35JwEMOG7E0Bo1tdFFr4vYw";

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
            const client = createClient(PROJECT_URL, PUBLIC_API_KEY);

            const { data, error } = await client.from("Events").select("*").eq('id', id).single();
            setError(error);
            setEvent(data);
        }
        getData();
    }, [id])


    if (error) {
        return <ErrorComponent message="Could not find this event" technical={`Database: ${error.code} - ${error.message}`}/>
    }

    if (event === null) {
        return <div>Loading...</div>
    }

    const badges: string[] = [];
    badges.push(event.start);
    badges.push(event.location);
    badges.push(event.accessability);

    return <div className="flex-1 flex flex-col justify-start items-center gap-2">
        <h2 className="font-bold text-3xl p-2 text-orange-700">This page is in construction</h2> 
        <p className="text-xl text-center md:text-left">
            It will look something like this:
        </p>

        <div className="flex flex-col bg-white rounded-3xl overflow-hidden w-full">
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
            <div className="p-6 text-gray-800 leading-relaxed text-sm md:text-base">
                {event.description}
            </div>
            { /* DO NOT USE THIS SHIT EVERYTHING IS BAD AND UGLY */}
            <div className="pl-6 text-gray-800 leading-relatex text-sm md:text-base">Probably some more information down here</div>
            <div className="pl-6 text-gray-800 leading-relatex text-sm md:text-base">Maybe a link to TribeLink</div>
            <div className="pl-6 text-gray-800 leading-relatex text-sm md:text-base">Maybe a link to the recipe</div>
            <div className="pl-6 pb-6 text-gray-800 leading-relatex text-sm md:text-base">¯\_(ツ)_/¯</div>
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