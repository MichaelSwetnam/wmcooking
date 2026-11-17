import { type AnyFieldApi } from "@tanstack/react-form";
import { InputWrapper } from "../InputWrapper";

export function TextInputDisabled({ field }: { field: AnyFieldApi }) {
     return <InputWrapper field={field}> 
	  <input 
	       type="text"
	       className="bg-gray-300 p-1 rounded-sm shadow-sm w-full text-center"
	       id={field.name}
	       name={field.name}
	       value={field.state.value}
	       onBlur={field.handleBlur}
	       disabled={true}
	  />
     </InputWrapper>
}

