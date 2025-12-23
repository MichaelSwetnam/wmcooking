import { useState } from "react";
import type { InputProp } from "./Inputs";

export default function DateInput({ id, startValue, onChange}: InputProp<Date>) {
    const [value, setValue] = useState(startValue);
    
    return <input 
        className="bg-white p-1 shadow-sm rounded-md" 
        type="datetime-local" 
        value={value.toISOString()}
        onChange={e => {
            console.log(e.target.value);
            throw new Error("Not implemented ---");
            setValue(new Date());
            onChange(id, value);
        }}
    />
}