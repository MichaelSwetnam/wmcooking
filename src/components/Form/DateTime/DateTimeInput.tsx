import { useState } from "react";
import DateInput from "./DateInput";
import TimeInput from "./TimeInput";

export default function DateTimeInput({ id, startValue, onChange }: { id: string, startValue: Date, onChange: (id: string, value: string) => void }) {   
    const [date, setDate] = useState(`${startValue.getUTCFullYear()}-${(startValue.getMonth() + 1).toString().padStart(2, "0")}-${startValue.getDate()}`);
    const [time, setTime] = useState(`${startValue.getHours()}:${startValue.getMinutes().toString().padStart(2, "0")}:${startValue.getSeconds().toString().padStart(2, "0")}`);

    function changeDate(_: string, value: string) {
        setDate(value);
        console.log("Date " + value);
        onChange(id, new Date(`${value}T${time}`).toISOString().split(".")[0]);
    }

    function changeTime(_: string, value: string) {
        setTime(value);
        onChange(id, new Date(`${date}T${value}`).toISOString().split(".")[0]);
    }

    return <div className="grid grid-cols-2 gap-1">
        <DateInput onChange={changeDate} id="date" startValue={date} />
        <TimeInput onChange={changeTime} id="time" startValue={time} />
    </div>
}