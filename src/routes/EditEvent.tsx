import { useEffect, useRef, useState } from "react";
import RequireAdminLogin from "../components/Auth/RequireAdminLogin";
import type { EventRecord } from "../lib/Database";
import type { PostgrestError } from "@supabase/supabase-js";
import Database from "../lib/Database";
import ErrorComponent from "../components/Event/ErrorComponent";
import { useParams } from "react-router-dom";
import LoadingComponent from "../components/Utility/LoadingComponent";

function InputLabel({ name }: { name: string }) {
    return <p className="w-full font-semibold text-gray-600">{name}</p>
}


type InputProp<T> = { id: string, startValue: T, onChange: (id: string, value: T) => void };

function ShortTextInput({ id, startValue, onChange }: InputProp<string>) {
    const [value, setValue] = useState(startValue);

    return <input className="bg-white p-1 shadow-sm rounded-md text-center" type="text" value={value} onChange={e => {
        setValue(e.target.value);
        onChange(id, e.target.value);
    }} />
}

function LongTextInput({ id, startValue, onChange }: InputProp<string>) {
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

function DateInput({ id, startValue, onChange}: InputProp<string>) {
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
function AccessabilityInput({ id, startValue, onChange}: InputProp<AccessabilityType>) {
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

export default function Page() {
    const { id } = useParams();
    const [event, setEvent] = useState<EventRecord | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);

    useEffect(() => {
        if (!id) return;
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) return;

        const getData = async () => {
            const { data, error } = await Database.getEvent(parsedId);

            setError(error);
            setEvent(data);
        }
        getData();
    }, [id])
    
    if (event === null)
        return <LoadingComponent />
    if (!id || isNaN(parseInt(id)))
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router as number. Given: '${id}'`} />
    if (error)
        return <ErrorComponent message={"Could not find the event you are looking for."} technical={error.message} />
    if (!event)
        return <ErrorComponent message={"Could not find the event you are looking for."} technical="No event data was shipped from database." />

    function onChange(id: string, value: unknown) {
        if (!event) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (event as any)[id] = value;
        console.log(event);
    }    

    return (
        <RequireAdminLogin>
            <div className="flex flex-col items-center justify-center">
                <form className="grid grid-cols-[1fr_4fr] items-center gap-3 w-full lg:w-2/3">
                    <InputLabel name="Title" />
                    <ShortTextInput id="title" startValue={event.name} onChange={onChange} />
                    <InputLabel name="Location" />
                    <ShortTextInput id="location" startValue={event.location} onChange={onChange} />
                    <InputLabel name="Description" />
                    <LongTextInput id="description" startValue={event.description} onChange={onChange} />
                    <InputLabel name="Event Start" />
                    <DateInput id="start" startValue={event.start} onChange={onChange} />
                    <InputLabel name="Event End" />
                    <DateInput id="end" startValue={event.start} onChange={onChange} />
                    <InputLabel name="Accessability" />
                    <AccessabilityInput id="accessability" startValue={event.accessability} onChange={onChange} />
                </form>
            </div>
        </RequireAdminLogin>
    );
}   