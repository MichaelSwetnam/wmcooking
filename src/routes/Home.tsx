import type { EventRecord } from "../lib/Database";

import { InstagramEmbed } from "react-social-media-embed";
import EventCard from "../components/EventCard";
import { useEffect, useState } from "react";
import Database from "../lib/Database";
import { PostgrestError } from "@supabase/supabase-js";
import ErrorComponent from "../components/ErrorComponent";
import LoadingComponent from "../components/LoadingComponent";

export default function Home() {
    const [events, setEvents] = useState<EventRecord[] | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);

    useEffect(() => {
        const load = async () => {
            const { data, error } = await Database.getNextEvents(3);
            setEvents(data);
            setError(error);
        }

        load();
    }, []);

    if (error) {
        return <ErrorComponent message="Could not find any events." technical={`Database: ${error.message}`}/>
    }

    if (events === null) {
        return <LoadingComponent />
    }
    
    return <div className="flex-1 flex flex-col md:flex-row justify-center items-center md:items-start gap-8">
        { /* Main Content */ }
        <div className="flex-2 flex flex-col items-center gap-5">
            <div className="flex flex-col items-center">
                <h2 className="pt-5 text-3xl md:text-4xl font-extrabold text-orange-700 text-center">Welcome to Club Cooking!</h2>
                <p className="text-xl text-center md:text-left">
                    Here's our next few events:
                </p>
            </div>
            { events.map((e, i) => <EventCard event={e} key={i} />) }
            <div className="p-2 text-xl font-semibold bg-white rounded-xl shadow-md">
                Stay tuned for more events coming soon.
            </div>
        </div>

        { /* Social Media Sidebar */}
        <div className="flex-1 flex flex-col items-center p-5 space-y-4 h-full gap-4">
            <div className="flex-1">
                <span className="font-semibold text-xl text-orange-700">Check out our instagram for updates and news.</span>
                <InstagramEmbed url="https://www.instagram.com/wmclubcooking/"/>
            </div>
            <div className="flex-1 h-full max-w-md">
                <a href="https://flathatnews.com/2025/09/09/serving-up-community-club-cooking-aims-to-create-inclusive-space-for-sharing-food/" target="_blank" className="font-semibold text-xl text-blue-600 hover:text-blue-800 transition underline">or check out on this article on us by the Flat Hat.</a>
                <iframe className="w-full aspect-square mt-2 rounded-lg shadow-md"
                    src="https://flathatnews.com/2025/09/09/serving-up-community-club-cooking-aims-to-create-inclusive-space-for-sharing-food/" 
                    title="Flat Hat Article - Serving up community: Club Cooking aims to create inclusive space for sharing food"
                    loading="lazy"
                />
            </div>
        </div>
    </div>
}