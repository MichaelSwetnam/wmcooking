import { useState } from "react";
import type { InputProp } from "./Inputs";

export default function DateInput({ id, startValue, onChange}: InputProp<string>) {
    const [value, setValue] = useState(startValue);
    
    return <input 
        className="bg-white p-1 shadow-sm rounded-md" 
        type="datetime-local" 
        value={value}
        onChange={e => {
            setValue(e.target.value);
            onChange(id, value);
        }}
    />
}