import { InputWrapper } from "../InputWrapper"
import { type AnyFieldApi } from "@tanstack/react-form"

export function TextAreaInput({ field }: { field: AnyFieldApi }) {
     return <InputWrapper field={field}> 
	  <textarea
	       className="bg-white p-1 rounded-sm shadow-sm w-full text-left"
	       id={field.name}
	       name={field.name}
	       value={field.state.value}
	       onBlur={field.handleBlur}
	       onChange={e => field.handleChange(e.target.value)}
	  />
     </InputWrapper>
}
