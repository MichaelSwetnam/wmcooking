import type { EventRecord } from "../../lib/Database";

function Day({ events }: { events: EventRecord[] }) {
    const date = new Date(events[0].start);

    return <div className=" 
        flex flex-col items-center
        rounded-md shadow-md hover:shadow-lg transition-shadow
        [background:repeating-linear-gradient(45deg,#fdba74_0px,#fdba74_16px,#fb923c_16px,#fb923c_32px)] text-gray-800 
    ">
        <p className="font-semibold">{date.toLocaleDateString('en-us', { weekday: "short", day: "numeric", month: "short" })}</p>
        { events.map((e, i) => 
        <div key={i} className="flex flex-row gap-2">
            <p className="font-semibold">
                {new Date(e.start).toLocaleTimeString('en-us', {hour: "numeric"})}
            </p> 
            <p>
                {e.name}   
            </p>          
        </div>)}
    </div>;
}

export default function MobileCalendar({ info }: { info: Map<string, EventRecord[]> }) {
    const keys = [];
    for (const key of info.keys()) {
        keys.push(key);
    }
    
    return <div className="flex flex-col">
        <div className="flex flex-col gap-2 p-1">
        { keys.map((k, i) => <Day key={i} events={info.get(k)!} />) }
        </div>
    </div>
}