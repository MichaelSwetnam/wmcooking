import { useEffect, useState } from "react";
import type { EventWrapper } from "../../lib/Database/Records/EventRecord";
import LoadingComponent from "../Utility/LoadingComponent";
import Database from "../../lib/Database/Database";
import DBError from "../../lib/Database/DBError";
import ErrorComponent from "../Event/ErrorComponent";

export default function AccessabilityInput({ event }: { event: EventWrapper }) {
    const [ allergyOptions, setOptions ] = useState<string[] | null>(null);
    const [ selectedAllergies, setSelected ] = useState<string[] | null>(null);
    const [ error, setError ] = useState<DBError | null>(null);

    useEffect(() => {
        Database.allergies.getLabels().then(labels => setOptions(labels));
        event.getAllergyLabels().then(r => {
            if (r.isError()) {
                setError(r.unwrapError);
                return;
            }

            setSelected(r.unwrapData());
        });
    }, [event])

    if (error) return <ErrorComponent message={error.message} />
    if (!allergyOptions || !selectedAllergies) return <LoadingComponent />

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selected = [];
        for (let i = 0; i < e.target.selectedOptions.length; i++) {
            const item = e.target.selectedOptions.item(i);
            if (!item) throw new Error("Encountered a selected item with no id??");

            selected.push(item.value);
        }

        event.setAllergyLabels(selected);
        setSelected(selected);
    }

    return <div className="flex flex-col">
        <select
            multiple
            className="bg-white p-1 shadow-sm rounded-sm"
            onChange={handleChange}
        >
            {
                allergyOptions.map((o, i) => {
                    const isSelected = selectedAllergies.find(x => x === o) !== undefined;  
                    return <option key={i} value={o} selected={isSelected}>{o[0] + o.slice(1).toLowerCase()}</option>
                })
            }
        </select>
        <p className="text-sm text-center">*Hold down the Ctrl (Windows) or Command (Mac) button to select multiple options.</p>
        <p className="text-sm text-center">**Ability to add new allergens is coming soon. I can add them for you if you text me.</p>
    </div> 
}