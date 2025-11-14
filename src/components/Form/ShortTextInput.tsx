import { useState } from "react";
import type { InputProp } from "./Inputs";

export default function ShortTextInput({ id, startValue, onChange }: InputProp<string>) {
    const [value, setValue] = useState(startValue);

    return <input className="bg-white p-1 shadow-sm rounded-md text-center" type="text" value={value} onChange={e => {
        setValue(e.target.value);
        onChange(id, e.target.value);
    }} />
}