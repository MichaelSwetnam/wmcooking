import { type AnyFieldApi } from "@tanstack/react-form";
export function InputWrapper({ field, children }: { field: AnyFieldApi, children: React.ReactNode }) {
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
