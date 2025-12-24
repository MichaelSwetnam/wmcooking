import { useState } from "react";
import type { InputProp } from "./Inputs";

export default function ShortTextInput({ id, startValue, onChange, min, max }: InputProp<number> & { min?: number, max?: number }) {
    const [value, setValue] = useState(startValue);
    const [message, setMessage] = useState("");

    function registerChange(input: string) {
        const num = parseInt(input);
        if (isNaN(num)) {
            setMessage("Input must be a valid number.");
            setValue(num);
            return;
        }

        if (min !== undefined && num < min) {
            setMessage("Input must be greater than " + min);
            setValue(num);
            return;
        }

        if (max !== undefined && num > max) {
            setMessage("Input must be less than " + max);
            setValue(num);
            return;
        }
        
        setMessage("");
        setValue(num);
        onChange(id, num);
    }

    return (
        <div className="flex flex-col flex-1 p-1 gap-2">
            <input className="flex flex-row shadow-sm rounded-sm flex-1 p-1 bg-white" type="number" value={value} onChange={e => registerChange(e.target.value)} />
                
            <p className="text-red-600 font-semibold text-center">{message}</p>
        </div>
    );
}