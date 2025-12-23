import { useEffect, useState } from "react";
import RequireAdminLogin from "../components/Auth/RequireAdminLogin";
import ErrorComponent from "../components/Event/ErrorComponent";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../components/Utility/LoadingComponent";
import EventPage from "../components/Event/EventPage";
import { InputLabel } from "../components/Form/Inputs";
import ShortTextInput from "../components/Form/ShortTextInput";
import LongTextInput from "../components/Form/LongTextInput";
import AccessabilityInput from "../components/Form/AccessabilityInputs";
import BooleanInput from "../components/Form/BooleanInput";
import Database from "../lib/Database/Database";
import { EventWrapper } from "../lib/Database/Records/EventRecord";
import TimeInput from "../components/Form/TimeInput";
import DateInput from "../components/Form/DateInput";

export default function Page() {
    const { id } = useParams();
    const [event, setEvent] = useState<EventWrapper | null>(null);
    const [error, setError] = useState<[string, string?] | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (!id) return;
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) return;

        const getData = async () => {
            const ret = await Database.events.get(parsedId);

            if (ret.isError()) {
                setError(["Error while loading event data.", ret.unwrapError().message])
            } else {
                setEvent(ret.unwrapData());
            }
        }
        getData();
    }, [id])

    if (error) {
        return <ErrorComponent message={error[0]} technical={error[1]} />
    }
    
    if (event === null)
        return <LoadingComponent />
    if (!id || isNaN(parseInt(id))) {
        setError(["Could not find the event you were looking for.", "Expected :id property from router as number."]);
        return;
    }
    if (!event) {
        setError(["Could not find the event you are looking for.", "No event data was shipped from the database."]);
        return;
    }

    function onChange(id: string, value: unknown) {
        if (!event) return;
        
        const deepCopy = JSON.parse(JSON.stringify(event));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (deepCopy as any)[id] = value;
        setEvent(new EventWrapper(deepCopy));
    }    

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!event) return;
        
        Database.events.update(event.id, event).then(r => {
            if (r.isError()) {
                setError(["Could not save your event changes.", r.unwrapError().message]);
            } else {
                nav(`/events/${r.unwrapData().id}`);
            }
        });
    }

    return (
        <RequireAdminLogin>
            <div className="flex flex-col gap-6">
                <form className="p-3 bg-blue- rounded-md flex flex-col items-center w-full gap-3" onSubmit={onSubmit}>
                    <div className="grid grid-cols-[1fr_4fr] items-center gap-3 w-full lg:w-3/4">
                        <InputLabel name="Title" />
                        <ShortTextInput id="name" startValue={event.name} onChange={onChange} />
                        <InputLabel name="Location" />
                        <ShortTextInput id="location" startValue={event.location} onChange={onChange} />
                        <InputLabel name="Description" />
                        <LongTextInput id="description" startValue={event.description} onChange={onChange} />
                        <InputLabel name="Date" />
                        <DateInput id="date" startValue={event.date} onChange={onChange} />
                        <InputLabel name="Start Time" />
                        <TimeInput id="start_time" startValue={event.start_time} onChange={onChange} />
                        <InputLabel name="End Time" />
                        <TimeInput id="end_time" startValue={event.end_time} onChange={onChange} />
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
                        <button
                            type="button"
                            className="bg-red-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => nav(`/events/${event.id}`)}
                        >
                            Exit
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