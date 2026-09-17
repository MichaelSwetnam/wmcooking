import { useParams } from "react-router-dom";
import LoadingComponent from "../components/Utility/LoadingComponent";
import { useCookingEvent } from "../lib/CookingEvent.ts";
import ErrorComponent from "../components/Utility/ErrorComponent.tsx";
import EventPage from "../components/Event/EventPage.tsx";

export default function Page() {
    const { id } = useParams();

    if (!id) {
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router. Given: '${id}'`} />
    }
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router with type number. Given: '${id}' which is NaN.`} />
    }
    
    const { data: event, isLoading, error } = useCookingEvent(parsedId);
    if (isLoading)
        return <LoadingComponent />

    if (error)
        return <ErrorComponent message="Could not find this event" technical={error.message}/>

    return <div className="flex-1 flex flex-col justify-start items-center gap-2 h-full">
        <h2 className="pt-5 text-3xl md:text-4xl font-extrabold text-orange-700 text-center">Event Details:</h2>
        <EventPage event={event}/> 
    </div>;
}
