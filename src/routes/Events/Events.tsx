import { useEffect, useLayoutEffect, useState } from "react";
import type { EventRecord } from "../../lib/Database";
import Database from "../../lib/Database";
import { PostgrestError } from "@supabase/supabase-js";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingComponent from "../../components/LoadingComponent";
import { useNavigate } from "react-router-dom";
import DesktopCalendar from "./DesktopCalendar";
import MobileCalendar from "./MobileCalendar";

export default function Events() {
    const [data, setData] = useState<EventRecord[] | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);
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
        const fx = async () => {
            const { data, error } = await Database.getEventsInMonth(month, year);
            setData(data);
            setError(error);
        };
        fx();
    }, [month, year]);

    if (error) {
        return <ErrorComponent message="Could not find this event" technical={`Database: ${error.code} - ${error.message}`} />;
    }

    if (data === null) {
        return <LoadingComponent />;
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

    
    return (
        <div className="flex-1 flex flex-col justify-start items-center gap-2">
            <h2 className="font-bold text-3xl p-2 text-orange-700">Event Calendar:</h2>
            <div className="flex flex-col p-3 bg-white shadow-xl w-full gap-1">
                { /* Tailwind CSS uses 48rem for md screens = 768 px https://tailwindcss.com/docs/responsive-design */ }
                {
                    width < 768
                    ? <MobileCalendar
                        year={year} 
                        month={month} 
                        increment={incrementMonth} 
                        decrement={decrementMonth}
                        info={info}
                    />
                    : <DesktopCalendar 
                        year={year} 
                        month={month} 
                        increment={incrementMonth} 
                        decrement={decrementMonth}
                        info={info}
                    />
                } 
            </div>
        </div>
    );
}
