import { useState } from "react";
import type { InputProp } from "./Inputs";

export default function BooleanInput({ id, startValue, onChange }: InputProp<boolean>) {
    const [value, setValue] = useState(startValue);

    return <input className="bg-white p-1 shadow-sm rounded-md text-center" type="checkbox" value={value ? "true" : "false"} onChange={e => {
        const bool = e.target.value === "true";
        setValue(bool);
        onChange(id, bool);
    }} />
}