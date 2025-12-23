import { useState } from "react";
import type { InputProp } from "./Inputs";

function isValid12Hour(hour: number, minute: number): boolean {
    return (
        Number.isInteger(hour) &&
        Number.isInteger(minute) &&
        hour >= 1 &&
        hour <= 12 &&
        minute >= 0 &&
        minute <= 59
    );
}

function convert24To12(time: string): { hour: number; minute: number; period: "AM" | "PM" } {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return { hour, minute: m, period };
}

function convert12To24(hour: number, minute: number, period: "AM" | "PM"): string {
    let h = hour % 12;
    if (period === "PM") h += 12;
    return `${h.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:00`;
}

export default function TimeInput({ id, startValue, onChange }: InputProp<string>) {
    const DEFAULT = "12:00:00";

    // Validate incoming Supabase time
    const safeStart = (() => {
        const parts = startValue.split(":");
        if (parts.length !== 3) return DEFAULT;
        const [h, m, s] = parts.map(Number);
        if (isNaN(h) || isNaN(m) || isNaN(s)) return DEFAULT;
        if (h < 0 || h > 23 || m < 0 || m > 59) return DEFAULT;
        return startValue;
    })();

    const { hour: initialHour, minute: initialMinute, period: initialPeriod } =
        convert24To12(safeStart);

    const [hour, setHour] = useState(initialHour);
    const [minute, setMinute] = useState(initialMinute);
    const [period, setPeriod] = useState<"AM" | "PM">(initialPeriod);
    const [message, setMessage] = useState("");

    function update(type: "hour" | "minute" | "period", value: string) {
        let h = hour;
        let m = minute;
        let p = period;

        if (type === "hour") h = parseInt(value);
        if (type === "minute") m = parseInt(value);
        if (type === "period") p = value as "AM" | "PM";

        setHour(h);
        setMinute(m);
        setPeriod(p);

        if (!isValid12Hour(h, m)) {
            setMessage(`${h}:${m.toString().padStart(2, "0")} ${p} is not a valid time.`);
            return;
        }

        setMessage("");
        const supabaseTime = convert12To24(h, m, p);
        onChange(id, supabaseTime);
    }

    return (
        <div className="flex flex-col flex-1 shadow-sm rounded-sm p-1 gap-2">
            <div className="flex flex-row flex-1 bg-white gap-4 items-center">
                <input
                    type="number"
                    value={hour}
                    onChange={(e) => update("hour", e.target.value)}
                    min={1}
                    max={12}
                />
                <p>:</p>
                <input
                    type="number"
                    value={minute}
                    onChange={(e) => update("minute", e.target.value)}
                    min={0}
                    max={59}
                />
                <select value={period} onChange={(e) => update("period", e.target.value)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
            <p className="text-red-600 font-semibold text-center">{message}</p>
        </div>
    );
}
