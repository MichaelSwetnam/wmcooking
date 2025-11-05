import { useEffect, useState } from "react";
import type { EventRecord } from "../lib/Database";
import Database from "../lib/Database";
import { PostgrestError } from "@supabase/supabase-js";
import ErrorComponent from "../components/ErrorComponent";
import LoadingComponent from "../components/LoadingComponent";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function DateBase({ day, info, active }: { day: Date, info: EventRecord[], active: boolean }) {
    const nav = useNavigate();
    const sorted = info.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    return (
        <div className={`
            p-2 flex flex-col items-center justify-center
            ${active ? "bg-white" : "bg-gray-200 text-gray-500 [background:repeating-linear-gradient(45deg,#f3f4f6_0px,#f3f4f6_20px,#e5e7eb_20px,#e5e7eb_40px)]" }
            rounded-md shadow-sm hover:shadow-md transition-all w-full
        `}>
            <p>
                {day.toLocaleDateString('en-us', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            <div className="w-full flex flex-col gap-1 overflow-y-auto mt-1">
                {sorted.map((x, i) => (
                    <button
                        key={i}
                        className={`
                            flex flex-row items-center gap-2
                            rounded-md p-2
                            shadow-sm hover:shadow-md active:scale-95 transition-all
                            ${active ? "[background:repeating-linear-gradient(45deg,#fdba74_0px,#fdba74_16px,#fb923c_16px,#fb923c_32px)] text-gray-800" : "bg-gray-20 text-gray-700"}
                            w-full
                            whitespace-normal
                            wrap-break-word
                            text-left
                            cursor-pointer
                        `}
                        onClick={() => nav(`/events/${x.id}`)}
                    >
                        <p className="font-semibold shrink-0 w-16">
                            {new Date(x.start).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                        </p>
                        <p className="flex-1">
                            {x.name}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

function DateBuilder({ day, info }: { day: Date, info: EventRecord[] }) {
    const currentDate = new Date();
    currentDate.setHours(-1);

    if (day < currentDate) {
        return <DateBase day={day} info={info} active={false} />;
    }

    return <DateBase day={day} info={info} active={true} />;
}

export default function Events() {
    const nav = useNavigate();
    const [data, setData] = useState<EventRecord[] | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);
    const [[ month, year ], setMonthYear ] = useState([new Date().getMonth(), new Date().getFullYear()]);
   
    useEffect(() => {
        if (window.innerWidth < 768) {
            // Will start an infinite load. This is because I don't want to query DB when this page won't even render on mobile no matter what.
            setData(null);
            setError(null);
        }

        const fx = async () => {
            const { data, error } = await Database.getEventsInMonth(month, year);
            setData(data);
            setError(error);
        };
        fx();
    }, [month, year]);

    if (window.innerWidth < 768) {
        return <div className="flex-1 flex flex-col justify-center items-center gap-3">
            <h2 className="pt-5 text-3xl md:text-4xl font-extrabold text-orange-700 text-center">This page is not available on mobile devices yet. Sorry!</h2>
            <div className="flex flex-col md:flex-row gap-1">
                <p className="text-gray-700">If you have any questions or concerns, please email us at </p>
                <a href="mailto:cooking@wm.edu" className="text-gray-700 underline hover:text-blue-600 transition duration-150">cooking@wm.edu</a>
            </div>
            
            <Button onClick={() => nav("/")}>Return to Main Page</Button>
        </div>
    }

    if (error) {
        return <ErrorComponent message="Could not find this event" technical={`Database: ${error.code} - ${error.message}`} />;
    }

    if (data === null) {
        return <LoadingComponent />;
    }

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

    const prevMonthLength = new Date(year, month, 0).getDate();
    const monthLength = new Date(year, month + 1, 0).getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month, monthLength).getDay();

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, prevMonthLength - i));
    }
    for (let i = 0; i < monthLength; i++) {
        days.push(new Date(year, month, i + 1));
    }
    for (let i = 1; i < 7 - lastDay; i++) {
        days.push(new Date(year, month + 1, i));
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
                <div className="w-full bg-blue-200 rounded-md p-3 text-center text-xl font-semibold">
                    <div className="flex flex-row justify-center items-center gap-3">
                        <button className="aspect-video bg-blue-300 py-1 px-3 rounded-md shadow-sm cursor-pointer" onClick={decrementMonth}>{"<"}</button>
                        <p>{new Date(year, month).toLocaleDateString('en-us', { month: "long", year: "numeric" })}</p>
                        <button className="aspect-video bg-blue-300 py-1 px-3 rounded-md shadow-sm cursor-pointer" onClick={incrementMonth}>{">"}</button>
                    </div>
                    
                </div>
                <div className="grid grid-cols-7 gap-2 rounded-lg">
                    {days.map((x, i) => (
                        <DateBuilder day={x} info={info.get(`${x.getMonth()}/${x.getDate()}`) ?? []} key={i} />
                    ))}
                </div>
            </div>
            
        </div>
    );
}
