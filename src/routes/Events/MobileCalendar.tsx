import { useNavigate } from "react-router-dom";
import { CookingEvent, useCookingEventsInMonth } from "../../lib/CookingEvent";
import ErrorComponent from "../../components/Utility/ErrorComponent";
import LoadingComponent from "../../components/Utility/LoadingComponent";
import calculateEventMap from "./calculateEventMap";

function Day({ events }: { events: CookingEvent[] }) {
    const nav = useNavigate();
    const date = events[0].getStartDate();

    const isToday = new Date().toDateString() === date.toDateString();
    const beforeToday = new Date().getTime() > date.getTime();
    if (isToday) {
        return <div className={`
            flex flex-col items-center
            rounded-md shadow-md hover:shadow-lg transition-shadow
            border-4 border-blue-400
            cursor-pointer
            ${
                beforeToday
                ? "bg-gray-200"
                : "[background:repeating-linear-gradient(45deg,#fdba74_0px,#fdba74_16px,#fb923c_16px,#fb923c_32px)]"
            }
            text-gray-800 
        `}>
            <p className="font-semibold">{date.toLocaleDateString('en-us', { weekday: "short", day: "numeric", month: "short" })}</p>
            { events.map((e, i) => 
            <div key={i} className="flex flex-row gap-2" onClick={() => nav(`/events/${e.id}`)}>
                <p className="font-semibold">
                    {e.getStartDate().toLocaleTimeString('en-us', {hour: "numeric"})}
                </p> 
                <p>
                    {e.name}   
                </p>          
            </div>)}
        </div>;
    }
    
    return <div className={`
            flex flex-col items-center
            rounded-md shadow-md hover:shadow-lg transition-shadow
            ${
                beforeToday
                ? "[background:repeating-linear-gradient(45deg,#f3f4f6_0px,#f3f4f6_20px,#e5e7eb_20px,#e5e7eb_40px)]"
                : "[background:repeating-linear-gradient(45deg,#fdba74_0px,#fdba74_16px,#fb923c_16px,#fb923c_32px)]"
            }
            text-gray-800 
            cursor-pointer
    `}>
        <p className="font-semibold">{date.toLocaleDateString('en-us', { weekday: "short", day: "numeric", month: "short" })}</p>
        { events.map((e, i) => 
        <div key={i} className="flex flex-row gap-2" onClick={() => nav(`/events/${e.id}`)}>
            <p className="font-semibold">
                {e.getStartDate().toLocaleTimeString('en-us', {hour: "numeric"})}
            </p> 
            <p>
                {e.name}   
            </p>          
        </div>)}
    </div>;
}

export default function MobileCalendar({ month, year }: { month: number, year: number }) {
     const { data: eventList, error, isLoading } = useCookingEventsInMonth(month, year);
     if (error) 
	  return <ErrorComponent message={error.message} />
     if (isLoading)
	  return <LoadingComponent />

     const eventMap = calculateEventMap(eventList);
     const keys = [];
     for (const key of eventMap.keys()) {
        keys.push(key);
     }

     if (keys.length <= 0) {
        return <div className="flex flex-col">
            <div className="flex flex-col gap-2 p-1">
                <div className="flex flex-row gap-2 justify-center bg-gray-200 p-2 rounded-md [background:repeating-linear-gradient(45deg,#f3f4f6_0px,#f3f4f6_20px,#e5e7eb_20px,#e5e7eb_40px)]">
                    <p>We don't have any events planned this month.</p>    
                </div>
            </div>
        </div>;
    }
    
    return <div className="flex flex-col">
        <div className="flex flex-col gap-2 p-1">
        { keys.map((k, i) => <Day key={i} events={eventMap.get(k)!} />) }
        </div>
    </div>
}
