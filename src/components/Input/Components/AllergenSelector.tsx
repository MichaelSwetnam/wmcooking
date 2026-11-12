import { useState } from "react";
import { useAllergyLabels } from "../../../lib/Allergens";
import { InputWrapper } from "../InputWrapper"
import { type AnyFieldApi } from "@tanstack/react-form"
import LoadingComponent from "../../Utility/LoadingComponent";
import ErrorComponent from "../../Utility/ErrorComponent";


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

export function AllergySelectorInput({ field }: { field: AnyFieldApi }) {
     const { data: labels, error, isLoading } = useAllergyLabels();
     if (isLoading) return <LoadingComponent />
     if (error) return <ErrorComponent message={error.message} />

     const selected = field.state.value;

     function handleChange(id: string, value: boolean) {
	  if (value) {
	       // Add to selection
	       const newSelected = [ ...selected, id ].sort();
	       field.handleChange(newSelected);
	  } else {
	       // Remove from selected
	       const newSelected = [];
	       for (const item of selected) {
		    if (item === id) continue;
		    newSelected.push(item);
	       }

	       field.handleChange(newSelected);
	  }

     }

     return <InputWrapper field={field}>
	 <div className="p-2 bg-white shadow-sm rounded-sm gap-1">
	     <div className="flex flex-wrap gap-2">
		 { labels.map((v, i) => {
		     const isSelected = selected.find(x => x === v) !== undefined;  
		     return <SelectComponent key={i} id={v} displayText={v[0] + v.slice(1).toLowerCase()} startValue={isSelected} callback={handleChange}/>;
		 })}
	     </div> 
	     <div className="flex flex-row gap-4">
		 <p key={0} className="text-gray text-sm font-normal text-center">⚠️: Event may contain this allergen.</p>
		 <p key={1} className="text-gray text-sm font-normal text-center">❌: Event does not contain this allergen.</p>
	     </div>
	 </div>
     </InputWrapper>;
}
