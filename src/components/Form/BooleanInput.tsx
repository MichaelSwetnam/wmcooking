import { useState } from "react";
import type { InputProp } from "./Inputs";

export default function BooleanInput({ id, startValue, onChange }: InputProp<boolean>) {
    const [value, setValue] = useState(startValue);

    return <input className="bg-white p-1 shadow-sm rounded-md text-center" type="checkbox" checked={value} onChange={e => {        
        setValue(e.target.checked)
        onChange(id, e.target.checked);
    }} />
}