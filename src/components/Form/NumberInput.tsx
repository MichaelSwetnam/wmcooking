import { useState } from "react";
import type { InputProp } from "./Inputs";

export default function ShortTextInput({ id, startValue, onChange, min, max }: InputProp<number> & { min?: number, max?: number }) {
    const [value, setValue] = useState(startValue);
    const [message, setMessage] = useState("");

    function registerChange(input: string) {
        const num = parseInt(input);
        if (isNaN(num)) {
            setMessage("Input must be a valid number.");
            return;
        }

        if (min !== undefined && num < min) {
            setMessage("Input must be greater than " + min);
            return;
        }

        if (max !== undefined && num > max) {
            setMessage("Input must be less than " + max);
            return;
        }
        
        setMessage("");
        setValue(num);
        onChange(id, num);
    }

    return (
        <div className="flex flex-col flex-1 shadow-sm rounded-sm p-1 gap-2">
            <input className="flex flex-row flex-1 bg-white" type="number" value={value} onChange={e => registerChange(e.target.value)} />
                
            <p className="text-red-600 font-semibold text-center">{message}</p>
        </div>
    );
}