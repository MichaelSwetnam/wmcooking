import { InputWrapper } from "../InputWrapper"
import { type AnyFieldApi } from "@tanstack/react-form"

export type SelectorOption = { val: string, display: string };
export function Selector({ field, options }: { field: AnyFieldApi, options: SelectorOption[] }) {
     return <InputWrapper field={field}>
	  <select
	       className="bg-white p-1 rounded-sm shadow-sm w-full text-center"
	       id={field.name}
	       name={field.name}
	       value={field.state.value}
	       onBlur={field.handleBlur}
	       onChange={e => field.handleChange(e.target.value)}
	  >
	       {options.map((x, i) => <option key={i} value={x.val}>{x.display}</option>) }
	  </select>
     </InputWrapper>
}
