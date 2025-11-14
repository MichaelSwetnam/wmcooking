import { useEffect, useRef, useState } from "react";
import type { InputProp } from "./Inputs";

export default function LongTextInput({ id, startValue, onChange }: InputProp<string>) {
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