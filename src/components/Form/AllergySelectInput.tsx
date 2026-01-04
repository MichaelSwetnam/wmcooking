import { useEffect, useState } from "react";
import type { EventWrapper } from "../../lib/Database/Records/EventRecord";
import LoadingComponent from "../Utility/LoadingComponent";
import Database from "../../lib/Database/Database";
import DBError from "../../lib/Database/DBError";
import ErrorComponent from "../Event/ErrorComponent";

function SelectComponent({ id, displayText, startValue, callback }: { id: string, displayText: string, startValue: boolean, callback: (id: string, value: boolean) => void }) {
    const [value, setValue] = useState(startValue);

    return <button 
        onClick={e => {
            e.preventDefault();
            setValue(!value);
            callback(id, !value);
        }}
        className={`py-1 px-10 rounded-sm cursor-pointer hover:shadow-md transition-shadow ` + (value ? "bg-blue-600 text-white" : "bg-gray-300 text-black")}
    >
        {value ? "⚠️" : "❌"} {displayText}
    </button>
}

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

    function handleChange(id: string, value: boolean) {
        const selected = [...selectedAllergies!];
        const index = selected.findIndex(t => t === id);
        
        if (value) {
            // Value is now TRUE, therefore this allergy is selected and should be added.
            if (index !== -1) {
                setError(DBError.custom(`Invariant state. Expected ${id} not to exist in selected. It was present at index ${index}`));
                return;
            }

            selected.push(id);
        } else {
            // Value is now FALSE, therefore this allergy is NOT selected and must be removed.
            if (index === -1) {
                setError(DBError.custom(`Invariant state. Expected ${id} to exist in selected. It did not.`));
                return;
            }

            selected.splice(index, 1);
        }

        event.setAllergyLabels(selected);
        setSelected(selected);
    }

    return <div className="p-2 bg-white shadow-sm rounded-sm gap-1">
        <div className="flex flex-wrap gap-2">
            { allergyOptions.map((v, i) => {
                const isSelected = selectedAllergies.find(x => x === v) !== undefined;  
                return <SelectComponent key={i} id={v} displayText={v[0] + v.slice(1).toLowerCase()} startValue={isSelected} callback={handleChange}/>;
            })}
        </div> 
        <div className="flex flex-row gap-4">
            <p className="text-gray text-sm font-normal text-center">⚠️: Event may contain this allergen.</p>
            <p className="text-gray text-sm font-normal text-center">❌: Event does not contain this allergen.</p>
        </div>
    </div>
}