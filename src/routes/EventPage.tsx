import { useParams } from "react-router-dom";
import ErrorComponent from "../components/Event/ErrorComponent";
import LoadingComponent from "../components/Utility/LoadingComponent";
import { useEffect, useState } from "react";
import EventPage from "../components/Event/EventPage";
import type { EventWrapper } from "../lib/Database/Records/EventRecord";
import Database from "../lib/Database/Database";
import type DBReturn from "../lib/Database/DBReturn";

export default function Page() {
    const { id } = useParams();
    const [event, setEvent] = useState<DBReturn<EventWrapper> | null>(null);
    

    useEffect(() => {
        const getData = async () => {
            if (!id) return;
            const parsedId = parseInt(id);
            if (isNaN(parsedId)) return;
            
            const ret = await Database.events.get(parsedId);
            setEvent(ret);
        }

        getData();
    }, [id])

    if (!id) {
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router. Given: '${id}'`} />
    }
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router with type number. Given: '${id}' which is NaN.`} />
    }
    
    if (event === null) {
        return <LoadingComponent />
    }

    if (event.isError()) {
        return <ErrorComponent message="Could not find this event" technical={event.unwrapError().message}/>
    }

    return <div className="flex-1 flex flex-col justify-start items-center gap-2 h-full">
        <h2 className="pt-5 text-3xl md:text-4xl font-extrabold text-orange-700 text-center">Event Details:</h2>
        <EventPage event={event.unwrapData()}/> 
    </div>;
}