import { useNavigate, useParams } from "react-router-dom";
import ErrorComponent from "../components/Event/ErrorComponent";
import  Database, { type EventRecord } from "../lib/Database";
import LoadingComponent from "../components/Utility/LoadingComponent";
import { useEffect, useState } from "react";
import type { PostgrestError } from "@supabase/supabase-js";
import EventPage from "../components/Event/EventPage";
import OAuth from "../lib/OAuth";
import Button from "../components/Utility/Button";

export default function Page() {
    const { id } = useParams();
    const [event, setEvent] = useState<EventRecord | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);
    const [isPrivileged, setPrivilege] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const getData = async () => {
            if (!id) return;
            const parsedId = parseInt(id);
            if (isNaN(parsedId)) return;
            
            const { data, error } = await Database.getEvent(parsedId);

            setError(error);
            setEvent(data);
        }
        const getAuth = async () => {
            const isAuth = await OAuth.isPrivileged();
            if (isAuth === true)
                setPrivilege(true);
        }
        getData();
        getAuth();
    }, [id])

    if (!id) {
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router. Given: '${id}'`} />
    }
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router with type number. Given: '${id}' which is NaN.`} />
    }

    if (error) {
        return <ErrorComponent message="Could not find this event" technical={`Database: ${error.code} - ${error.message}`}/>
    }

    if (event === null) {
        return <LoadingComponent />
    }


    return <div className="flex-1 flex flex-col justify-start items-center gap-2 h-full">
        <h2 className="pt-5 text-3xl md:text-4xl font-extrabold text-orange-700 text-center">Event Details:</h2>
        <EventPage event={event}/> 
        {isPrivileged &&
            <Button onClick={() => nav(`/events/${id}/edit`)}>Edit</Button>
        }
    </div>;
}