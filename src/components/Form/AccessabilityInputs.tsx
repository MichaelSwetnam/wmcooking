import { useState } from "react";
import type { EventRecord } from "../../lib/Database";
import type { InputProp } from "./Inputs";

type AccessabilityType = EventRecord["accessability"];
export default function AccessabilityInput({ id, startValue, onChange}: InputProp<AccessabilityType>) {
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