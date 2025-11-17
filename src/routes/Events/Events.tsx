import { useEffect, useLayoutEffect, useState } from "react";
import ErrorComponent from "../../components/Event/ErrorComponent";
import LoadingComponent from "../../components/Utility/LoadingComponent";
import DesktopCalendar from "./DesktopCalendar";
import MobileCalendar from "./MobileCalendar";
import type { EventRecord } from "../../lib/Database/Records/EventRecord";
import Database from "../../lib/Database/Database";

export default function Events() {
    const [data, setData] = useState<EventRecord[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [[ month, year ], setMonthYear ] = useState([new Date().getMonth(), new Date().getFullYear()]);
    
    const [width, setWidth] = useState(window.innerWidth);

    // Listen to window resize
    useLayoutEffect(() => {
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth)
        })
    }, []);

    // Get events from database 
    useEffect(() => {
        setData(null);
        setError(null);
        const fx = async () => {
            const ret = await Database.events.getEventsInMonth(month, year);
            if (ret.isError()) {
                setError(ret.unwrapError().message)
            } else {
                setData(ret.unwrapData());
            }
        };
        fx();
    }, [month, year]);

    if (error) {
        return <ErrorComponent message="Could not find this event" technical={error} />;
    }

    if (data === null) {
        return (
            <div className="flex flex-col p-3 bg-white shadow-xl w-full gap-1 rounded-md">
                <div className="w-full bg-blue-200 rounded-md p-3 text-center text-xl font-semibold">
                    <div className="flex flex-row justify-center items-center gap-3">
                        <button className="aspect-video bg-blue-300 py-1 px-3 rounded-md shadow-sm cursor-pointer" onClick={incrementMonth}>{"<"}</button>
                        <p>{new Date(year, month).toLocaleDateString('en-us', { month: "long", year: "numeric" })}</p>
                        <button className="aspect-video bg-blue-300 py-1 px-3 rounded-md shadow-sm cursor-pointer" onClick={decrementMonth}>{">"}</button>
                    </div>
                </div>
                <LoadingComponent />
            </div>
        );
    }

    // Format data base information into a Map of day -> event[]
    const info = new Map<string, EventRecord[]>();
    for (const event of data) {
        const startTime = new Date(event.start);
        const startDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
        const dateString = `${startDate.getMonth()}/${startDate.getDate()}`;

        if (info.has(dateString)) {
            info.get(dateString)?.push(event);
        } else {
            info.set(dateString, [event]);
        }
    }

    function incrementMonth() {
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth >= 12) {
            newMonth = 0;
            newYear++;
        }

        setMonthYear([ newMonth, newYear ]);
    }

    function decrementMonth() {
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setMonthYear([ newMonth, newYear ]);
    }

    
    return <div className="flex flex-col p-3 bg-white shadow-xl w-full gap-1 rounded-md">
        <div className="w-full bg-blue-200 rounded-md p-3 text-center text-xl font-semibold">
            <div className="flex flex-row justify-center items-center gap-3">
                <button className="aspect-video bg-blue-300 py-1 px-3 rounded-md shadow-sm cursor-pointer" onClick={decrementMonth}>{"<"}</button>
                <p>{new Date(year, month).toLocaleDateString('en-us', { month: "long", year: "numeric" })}</p>
                <button className="aspect-video bg-blue-300 py-1 px-3 rounded-md shadow-sm cursor-pointer" onClick={incrementMonth}>{">"}</button>
            </div>
        </div>
        { /* Tailwind CSS uses 48rem for md screens = 768 px https://tailwindcss.com/docs/responsive-design */ }
        {
            width < 768
            ? <MobileCalendar
                info={info}
            />
            : <DesktopCalendar 
                year={year} 
                month={month} 
                info={info}
            />
        } 
    </div>
}