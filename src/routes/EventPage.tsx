import { useNavigate, useParams } from "react-router-dom";
import ErrorComponent from "../components/Event/ErrorComponent";
import LoadingComponent from "../components/Utility/LoadingComponent";
import { useEffect, useState } from "react";
import EventPage from "../components/Event/EventPage";
import OAuth from "../lib/OAuth";
import Button from "../components/Utility/Button";
import type { EventRecord } from "../lib/Database/EventRecord";
import Database from "../lib/Database/Database";

export default function Page() {
    const { id } = useParams();
    const [event, setEvent] = useState<EventRecord | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPrivileged, setPrivilege] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const getData = async () => {
            if (!id) return;
            const parsedId = parseInt(id);
            if (isNaN(parsedId)) return;
            
            const ret = await Database.events.get(parsedId);
            if (ret.isError()) {
                setError(ret.unwrapError().message)
            } else {
                setEvent(ret.unwrapData());
            }
        }
        const getAuth = async () => {
            const r = await OAuth.isPrivileged();
            if (r.isError()) setPrivilege(false);
            const isAuth = r.unwrapData();
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
        return <ErrorComponent message="Could not find this event" technical={error}/>
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