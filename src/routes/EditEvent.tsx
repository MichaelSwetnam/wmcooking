import { useForm } from "@tanstack/react-form"
import type { AnyFieldApi } from "@tanstack/react-form";

type ValidatorProp = { value: string };
type ValidatorFn = (_: ValidatorProp) => string | undefined;

const onChangeComp = (fn: ValidatorFn) => ({ onChange: (prop: ValidatorProp) => fn(prop) });
const Validators = {
     required: () => onChangeComp(({value}) => !value ? 'This field is required.' : undefined ),
     lengthGreaterEqual: (x: number) => onChangeComp(({value}) => value && (value.length <= x ? `This field must contain ${x} or more characters.` : undefined ) ),
     lengthGreater: (x: number) => Validators.lengthGreaterEqual(x+1),

     // For now, only onChange is supported. 
     compose(fns: { onChange: ValidatorFn }[]) {
	  return {
	       onChange: (prop: ValidatorProp) => {
		    for (const fn of fns) {
			 let result: string | undefined;
			 if (result = fn.onChange(prop)) return result;
		    }
		    return undefined;
	       }
	  }
     }
};

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
	       className="bg-white p-1 rounded-sm shadow-sm w-full text-center"
	       id={field.name}
	       name={field.name}
	       value={field.state.value}
	       onBlur={field.handleBlur}
	       onChange={e => field.handleChange(e.target.value)}
	  />
     </InputWrapper>
}

const Components = {
     TextInput: (field: AnyFieldApi) => <TextInput field={field} />
}

export default function EditEvent() {
     const form = useForm({
	  defaultValues: {
	       title: '',
	       location: '',
	  },
	  onSubmit: async ({ value }) => alert(JSON.stringify(value))
     });
     
     return <form
	  className="w-full flex flex-col items-center gap-3"
	  onSubmit={e => {
	       e.preventDefault();
	       e.stopPropagation();
	       form.handleSubmit();
	  }}
     >
	  <form.Field
	       name="title"
	       validators={Validators.required()}
	       children = {Components.TextInput} 
	  />
	  <form.Field
	       name="location"
	       validators={Validators.compose([Validators.required(), Validators.lengthGreaterEqual(3)])}
	       children = {Components.TextInput} 
	  />
     </form>
}
