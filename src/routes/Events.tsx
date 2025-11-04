import { useState } from "react";
import EventCard from "../components/EventCard";
import type { EventRecord } from "../lib/Database";

export default function Events() {
    const [searchInput, setSearchInput] = useState('');

    const fakeEvent: EventRecord = {
        accessability: "AllStudents",
        description: "Fake Event",
        end: new Date().toISOString(),
        id: 0,
        location: "Fake Hall",
        name: "Fake Event",
        start: new Date().toISOString()
    }
    
    return <div className="flex-1 flex flex-col justify-start items-center gap-2">
        <h2 className="font-bold text-3xl p-2 text-orange-700">This page is in construction</h2> 
        <p className="text-xl text-center md:text-left">
            It will look something like this:
        </p>

        <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="text-2xl bg-white p-2 mt-2 rounded-md text-black shadow-md hover:shadow-lg transition-shadow w-2/3 text-center"
        />
        <div>
            <EventCard event={fakeEvent}/>
        </div>
    </div>;
}