import { useEffect, useState } from "react"
import LoadingComponent from "../Utility/LoadingComponent";
import type { EventWrapper } from "../../lib/Database/Records/EventRecord";
import ErrorComponent from "./ErrorComponent";

export default function AllergyBadge({ event }: { event: EventWrapper }) {
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
    
    if (allergies.length <= 0) return <></>

    return <div className="bg-amber-300 p-2 rounded-xl shadow-sm">
        <span className="font-semibold">May contain: {
            allergies
            .sort()
            .map((s, i) => 
                (i === 0 && s[0].toUpperCase() + s.slice(1).toLowerCase())
                || ( i !== allergies.length - 1 && s.toLowerCase())
                || ` and ${s.toLowerCase()}`
            ).join(", ")
        }</span>
    </div>
}
