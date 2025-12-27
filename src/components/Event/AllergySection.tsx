import { useEffect, useState } from "react";
import type { EventWrapper } from "../../lib/Database/Records/EventRecord";
import LoadingComponent from "../Utility/LoadingComponent";
import ErrorComponent from "./ErrorComponent";

export default function AllergySection({ event }: { event: EventWrapper}) {
    const [ allergies, setAllergies ] = useState<string[] | null>(null);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        event.getAllergyLabels().then(d => {
            if (d.isError()) {
                setError(d.unwrapError().message);
                return;
            }

            setAllergies(d.unwrapData());
        })
    }, [event]);

    if (error) return <ErrorComponent message="Could not load allergy information. Please email cooking@wm.edu for more information on present allergens." technical={error} reveal={true} />
    if (!allergies) return <LoadingComponent />

    if (allergies.length <= 0) return <div>
        <p className="text-gray-800 font-semibold">Allergy Information: </p>
        <p>No allergens have been listed for this event. For more information, please send an email to <a href="mailto:cooking@wm.edu" className="underline hover:text-blue-600 transition">cooking@wm.edu</a>.</p>
    </div>

    return <div>
        <p className="text-gray-800 font-semibold">Allergy Information:</p>
        <p>This event may contain the following allergens:</p>
        <ul className="w-full items-center pl-3 list-disc">
            {
                allergies.sort().map((s, i) => <li key={i}>{s[0].toUpperCase() + s.slice(1).toLowerCase()}</li>)
            }
        </ul>
        <p>For more information, please send an email to <a href="mailto:cooking@wm.edu" className="underline hover:text-blue-600 transition">cooking@wm.edu</a>.</p>
    </div>
}