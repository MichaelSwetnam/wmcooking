import { useEffect, useState } from "react";
import type { EventRecord } from "../lib/Database";
import Database from "../lib/Database";
import { PostgrestError } from "@supabase/supabase-js";
import ErrorComponent from "../components/ErrorComponent";
import LoadingComponent from "../components/LoadingComponent";
import { useNavigate } from "react-router-dom";

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

    if (day.getMonth() !== currentDate.getMonth() || day < currentDate) {
        return <DateBase day={day} info={info} active={false} />;
    }

    return <DateBase day={day} info={info} active={true} />;
}

export default function Events() {
    const [data, setData] = useState<EventRecord[] | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);

    useEffect(() => {
        const fx = async () => {
            const { data, error } = await Database.getEventsInCurrentMonth();
            setData(data);
            setError(error);
        };
        fx();
    }, []);

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

    const date = new Date();
    const fullYear = date.getFullYear();
    const month = date.getMonth();

    const prevMonthLength = new Date(fullYear, month, 0).getDate();
    const monthLength = new Date(fullYear, month + 1, 0).getDate();

    const firstDay = new Date(fullYear, month, 1).getDay();
    const lastDay = new Date(fullYear, month, monthLength).getDay();

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push(new Date(fullYear, month - 1, prevMonthLength - i));
    }
    for (let i = 0; i < monthLength; i++) {
        days.push(new Date(fullYear, month, i + 1));
    }
    for (let i = lastDay + 1; i < 7; i++) {
        days.push(new Date(fullYear, month + 1, i));
    }

    return (
        <div className="flex-1 flex flex-col justify-start items-center gap-2">
            <h2 className="font-bold text-3xl p-2 text-orange-700">Events this month:</h2>
            <div className="grid grid-cols-7 gap-2 rounded-lg p-3 bg-white shadow-xl hover:shadow-2xl transition-shadow w-full">
                {days.map((x, i) => (
                    <DateBuilder day={x} info={info.get(`${x.getMonth()}/${x.getDate()}`) ?? []} key={i} />
                ))}
            </div>
        </div>
    );
}
