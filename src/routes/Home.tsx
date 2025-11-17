import { InstagramEmbed } from "react-social-media-embed";
import EventCard from "../components/Event/EventCard";
import { useEffect, useState } from "react";
import ErrorComponent from "../components/Event/ErrorComponent";
import LoadingComponent from "../components/Utility/LoadingComponent";
import type { EventRecord } from "../lib/Database/EventRecord";
import Database from "../lib/Database/Database";

function EventsSubpage() {
    const [events, setEvents] = useState<EventRecord[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const ret  = await Database.events.getNextEvents(3);
            if (ret.isError())
                setError(ret.unwrapError().message);
            else
                setEvents(ret.unwrapData());            
        }

        load();
    }, []);

    if (error) {
        return <ErrorComponent message="Could not find any events." technical={error}/>
    }

    if (events === null) {
        return <LoadingComponent />
    }

    return <div className="flex flex-col gap-5">
        { events.map((e, i) => <EventCard event={e} key={i} />) }
    </div> 
}

export default function Home() {
    return <div className="flex-1 flex flex-col md:flex-row justify-center items-center md:items-start gap-8">
        { /* Main Content */ }
        <div className="flex-2 flex flex-col items-center gap-5">
            <div className="flex flex-col items-center">
                <h2 className="pt-5 text-3xl md:text-4xl font-extrabold text-orange-700 text-center">Welcome to Club Cooking!</h2>
                <p className="text-xl text-center md:text-left">
                    Here's our next few events:
                </p>
            </div>
            <EventsSubpage />
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
            <a href="https://flathatnews.com/2025/09/09/serving-up-community-club-cooking-aims-to-create-inclusive-space-for-sharing-food/" target="_blank" className="font-semibold text-xl text-blue-600 hover:text-blue-800 transition underline">or check out on this article on us by the Flat Hat.</a>
        </div>
    </div>
}