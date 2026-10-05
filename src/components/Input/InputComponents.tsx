import type { AnyFieldApi, AnyFormApi } from "@tanstack/react-form";

function InputWrapper({ field, children }: { field: AnyFieldApi, children: React.ReactNode }) {
     let capitalized: string;
     if (field.name.length <= 1)
	  capitalized = field.name;
     else
	  capitalized = field.name[0].toUpperCase() + field.name.slice(1)

     return <div className="w-full flex flex-col gap-3 md:grid grid-cols-[1fr_4fr] md:items-center lg:w-3/4 text-center">
	  <label className="font-semibold text-gray-500 text-right">{capitalized}</label> 
	  {children}
	  {field.state.meta.isTouched && !field.state.meta.isValid ? (
	  <em className="text-red-500 font-semibold col-span-full">{field.state.meta.errors.join(',')}</em>
	  ) : null}
	  {field.state.meta.isValidating ? 'Validating...' : null}
     </div>
}

function TextInput({ field }: { field: AnyFieldApi }) {
     return <InputWrapper field={field}> 
	  <input 
	       type="text"
	       className="bg-white p-1 rounded-sm shadow-sm w-full text-center"
	       id={field.name}
	       name={field.name}
	       value={field.state.value}
	       onBlur={field.handleBlur}
	       onChange={e => field.handleChange(e.target.value)}
	  />
     </InputWrapper>
}

function NumberInput({ field }: { field: AnyFieldApi }) {
     return <InputWrapper field={field}>
	  <input 
	       type="number"
	       step="any"
	       className="bg-white p-1 rounded-sm shadow-sm w-full text-center"
	       id={field.name}
	       name={field.name}
	       value={field.state.value}
	       onBlur={field.handleBlur}
	       onChange={e => field.handleChange(e.target.value)}
	  />
     </InputWrapper>
}

function DateTimeInput({ field }: { field: AnyFieldApi}) {
     return <InputWrapper field={field}>
	  <input 
	       type="datetime-local"
	       step="any"
	       className="bg-white p-1 rounded-sm shadow-sm w-full text-center"
	       id={field.name}
	       name={field.name}
	       value={field.state.value}
	       onBlur={field.handleBlur}
	       onChange={e => field.handleChange(e.target.value)}
	  />
     </InputWrapper>
}

function SubmitButton({ form, text}: { form: AnyFormApi, text: string }) {
     return <button
	  className="font-bold text-white bg-blue-400 p-3 rounded-md shadow-md"
	  type="submit"
	  onClick={() => { form.handleSubmit({ submitAction: 'backToMenu' })}}
     >{text}</button>
}

type SelectorOption = { val: string, display: string };
function Selector({ field, options }: { field: AnyFieldApi, options: SelectorOption[] }) {
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

function Checkbox({ field }: { field: AnyFieldApi }) {
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

const Components = {
     Text: () => (field: AnyFieldApi) => <TextInput field={field} />,
     Number: () => (field: AnyFieldApi) => <NumberInput field={field} />,
     DateTime: () => (field: AnyFieldApi) => <DateTimeInput field={field} />,
     Selector: (options: SelectorOption[]) => (field: AnyFieldApi) => <Selector field={field} options={options} />,
     Checkbox: () => (field: AnyFieldApi) => <Checkbox field={field} />,
     Submit: SubmitButton
}

export default Components;
