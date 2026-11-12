import type { AnyFieldApi } from "@tanstack/react-form";
import { InputWrapper } from "../InputWrapper";

export function Checkbox({ field }: { field: AnyFieldApi }) {
     return <InputWrapper field={field}>
	  <input 
	       type="checkbox"
	       step="any"
	       className="bg-white p-1 rounded-sm shadow-sm w-full text-center"
	       id={field.name}
	       name={field.name}
	       checked={field.state.value}
	       onBlur={field.handleBlur}
	       onChange={e => field.handleChange(e.target.checked)}
	  />
     </InputWrapper>
}
