import { useEffect, useState } from "react";
import RequireAdminLogin from "../components/Auth/RequireAdminLogin";
import type { EventRecord } from "../lib/Database";
import type { PostgrestError } from "@supabase/supabase-js";
import Database from "../lib/Database";
import ErrorComponent from "../components/Event/ErrorComponent";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../components/Utility/LoadingComponent";
import EventPage from "../components/Event/EventPage";
import { InputLabel } from "../components/Form/Inputs";
import ShortTextInput from "../components/Form/ShortTextInput";
import LongTextInput from "../components/Form/LongTextInput";
import DateInput from "../components/Form/DateInput";
import AccessabilityInput from "../components/Form/AccessabilityInputs";
import BooleanInput from "../components/Form/BooleanInput";


export default function Page() {
    const { id } = useParams();
    const [event, setEvent] = useState<EventRecord | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const nav = useNavigate();

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
        
        const deepCopy = JSON.parse(JSON.stringify(event));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (deepCopy as any)[id] = value;
        setEvent(deepCopy);
    }    

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!event) return;
        
        Database.updateEvent(event.id, event).then(error => {
            if (error === undefined) {
                nav("/events/" + event.id);
            } else {
                throw new Error(error);
            }
        });
    }

    return (
        <RequireAdminLogin>
            <div className="flex flex-col gap-6">
                <form className="p-3 bg-blue- rounded-md flex flex-col items-center w-full gap-3" onSubmit={onSubmit}>
                    <div className="grid grid-cols-[1fr_4fr] items-center gap-3 w-full lg:w-2/3">
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
                        <InputLabel name="Signup Required?" />
                        <BooleanInput id="requires_signup" startValue={event.requires_signup} onChange={onChange} />
                    </div>
                    <div className="flex flex-row gap-2">
                        <input type="submit" value="Save" className="bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow" />
                        <button 
                            type="button"
                            className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => {
                                setModalOpen(true);
                            }}
                        >
                            Preview
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal  */}
            { isModalOpen &&
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-3">
                    <div className="flex flex-col gap-3">
                        <EventPage event={event} />
                        <button 
                            className="bg-red-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => {
                                setModalOpen(false);
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            }
            
        </RequireAdminLogin>
    );
}   