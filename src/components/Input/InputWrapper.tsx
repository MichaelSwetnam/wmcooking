import { type AnyFieldApi } from "@tanstack/react-form";
export function InputWrapper({ field, children }: { field: AnyFieldApi, children: React.ReactNode }) {
     // Split to last period
     const periodSplit = field.name.split(".") as string[];
     const text = periodSplit[periodSplit.length - 1];

     // Capitalize first
     let capitalized: string;
     if (text.length <= 1)
	  capitalized = text;
     else
	  capitalized = text[0].toUpperCase() + text.slice(1)

     // Replace _ with " "
     const finalText = capitalized.replaceAll("_", " ");

     return <div className="w-full flex flex-col gap-3 md:grid grid-cols-[1fr_4fr] md:items-center lg:w-3/4 text-center">
	  <label className="font-semibold text-gray-500 text-right">{finalText}</label> 
	  {children}
	  {field.state.meta.isTouched && !field.state.meta.isValid ? (
	  <em className="text-red-500 font-semibold col-span-full">{field.state.meta.errors.join(',')}</em>
	  ) : null}
	  {field.state.meta.isValidating ? 'Validating...' : null}
     </div>
}
