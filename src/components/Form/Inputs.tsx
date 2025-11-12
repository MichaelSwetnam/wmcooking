import { useEffect, useRef, useState } from "react";
import type { EventRecord } from "../../lib/Database";

export function InputLabel({ name }: { name: string }) {
    return <p className="w-full font-semibold text-gray-600">{name}</p>
}


type InputProp<T> = { id: string, startValue: T, onChange: (id: string, value: T) => void };

export function ShortTextInput({ id, startValue, onChange }: InputProp<string>) {
    const [value, setValue] = useState(startValue);

    return <input className="bg-white p-1 shadow-sm rounded-md text-center" type="text" value={value} onChange={e => {
        setValue(e.target.value);
        onChange(id, e.target.value);
    }} />
}

export function LongTextInput({ id, startValue, onChange }: InputProp<string>) {
    const [value, setValue] = useState(startValue);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // Adjust height on content change
    useEffect(() => {
        const el = textAreaRef.current;
        if (!el) return;
        el.style.height = "auto"; // Reset height first
        el.style.height = `${el.scrollHeight}px`; // Set to scroll height
    }, [value]);

    return <textarea
        id={id}
        ref={textAreaRef}
        value={value}
        onChange={(e) => {
            setValue(e.target.value)
            onChange(id, e.target.value)
        }}
        className="bg-white overflow-hidden p-1 shadow-sm rounded-md w-full text-wrap resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={1} // start small; expands automatically
    />;
}

export function DateInput({ id, startValue, onChange}: InputProp<string>) {
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

type AccessabilityType = EventRecord["accessability"];
export function AccessabilityInput({ id, startValue, onChange}: InputProp<AccessabilityType>) {
    const [state, setState] = useState<AccessabilityType>(startValue);

    return <select 
        className="bg-white p-1 shadow-sm rounded-sm"
        onChange={e => {
            setState(e.target.value as AccessabilityType);
            onChange(id, e.target.value as AccessabilityType);
        }} 
        value={state}
    >
        <option value="AllStudents">All Students</option>
        <option value="ClubMembers">Club Members</option>
    </select>
}