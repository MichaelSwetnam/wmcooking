import { useState } from "react";
import type { InputProp } from "./Inputs";

function isValidYMD(year: number, month: number, day: number): boolean {
    const d = new Date(year, month - 1, day);

    return (
        d.getFullYear() === year &&
        d.getMonth() === month - 1 &&
        d.getDate() === day
    );
}

export default function DateInput({ id, startValue, onChange }: InputProp<string>) {
    const DEFAULT = "2025-01-01";

    // If startValue is invalid, replace it immediately
    const safeStart = (() => {
        const parts = startValue.split("-");
        const y = parseInt(parts[0]);
        const m = parseInt(parts[1]);
        const d = parseInt(parts[2]);
        return isValidYMD(y, m, d) ? startValue : DEFAULT;
    })();

    const [value, setValue] = useState(safeStart);
    const [message, setMessage] = useState("");

    const split = value.split("-");
    let year = parseInt(split[0]);
    let month = parseInt(split[1]);
    let day = parseInt(split[2]);

    function registerChange(val: string, type: "year" | "month" | "day") {
        const parsed = parseInt(val);
        if (isNaN(parsed)) return;

        switch (type) {
            case "year":
                year = parsed;
                break;
            case "month":
                month = parsed;
                break;
            case "day":
                day = parsed;
                break;
        }

        const newValue = `${year}-${month}-${day}`;
        setValue(newValue);

        if (!isValidYMD(year, month, day)) {
            setMessage(`${month}/${day}/${year} is not a valid date.`);
        } else {
            setMessage("");
            onChange(id, newValue);
        }
    }

    return (
        <div className="flex flex-col flex-1 shadow-sm rounded-sm p-1 gap-2">
            <div className="flex flex-row flex-1 bg-white gap-4">
                <input
                    type="number"
                    value={month}
                    onChange={(e) => registerChange(e.target.value, "month")}
                />
                <p>/</p>
                <input
                    type="number"
                    value={day}
                    onChange={(e) => registerChange(e.target.value, "day")}
                />
                <p>/</p>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => registerChange(e.target.value, "year")}
                />
            </div>
            <p className="text-red-600 font-semibold text-center">{message}</p>
        </div>
    );
}
