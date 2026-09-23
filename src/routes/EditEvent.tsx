import { useForm } from "@tanstack/react-form"
import type { AnyFieldApi, AnyFormApi } from "@tanstack/react-form";

type ValidatorProp = { value: string };
type ValidatorFn = (_: ValidatorProp) => string | undefined;

const onChangeComp = (fn: ValidatorFn) => ({ onChange: (prop: ValidatorProp) => fn(prop) });
const Validators = {
     // Generic
     required: () => onChangeComp(({value}) => !value ? 'This field is required.' : undefined ),
     
     // String 
     lengthGreaterEqual: (x: number) => onChangeComp(({value}) => value && (value.length <= x ? `This field must contain ${x} or more characters.` : undefined ) ),
     isHyperlink: () => onChangeComp(({ value }) => {
	  if (!value) return undefined;
	  try {
	       // This is not the best method ever but it will work for now!
	       new URL(value)
	       return undefined; // Was a valid link
	  } catch (e) {
	       if (e instanceof TypeError) return 'This field must be a valid URL.'
	       throw e;
	  }

     }),

     // lengthGreater: (x: number) => Validators.lengthGreaterEqual(x+1),

     // Numeric
     // Text input does not return a value unless it is a valid number apparently.
     // isNumber: () => onChangeComp(({value}) => value && (isNaN(parseInt(value)) ? 'This field must be a number.' : undefined )),
     isInt: () => onChangeComp(({ value }) => {
	  if (!value) undefined; 
	  const num = parseFloat(value);
	  if (isNaN(num)) return 'This field must contain a valid number.'; 
	  if (Math.ceil(num) !== num) return 'This field must contain a whole number (no decimal component)';
	  return undefined;
     }),
     isGreaterThan: (x: number) => onChangeComp(({ value }) => {
	  if (!value) return undefined; 
	  const num = parseFloat(value);
	  if (isNaN(num)) return 'This field must contain a valid number.'; 
	  if (num <= x) return `This field must contain a number greater than ${x}`;
	  return undefined;
     }),
     isPositive: () => Validators.isGreaterThan(0),


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

function SubmitButton({ form, text}: { form: AnyFormApi, text: string }) {
     return <button
	  className="font-bold text-white bg-blue-400 p-3 rounded-md shadow-md"
	  type="submit"
	  onClick={() => { form.handleSubmit({ submitACtion: 'backToMenu' })}}
     >{text}</button>
}

const Components = {
     Text: (field: AnyFieldApi) => <TextInput field={field} />,
     Number: (field: AnyFieldApi) => <NumberInput field={field} />,
     Submit: SubmitButton
}

export default function EditEvent() {
     const form = useForm({
	  defaultValues: {
	       title: '',
	       location: '',
	  },
	  onSubmit: ({ value }) => console.log(value) 
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
	       children = {Components.Text} 
	  />
	  <form.Field
	       name="location"
	       validators={Validators.compose([Validators.required(), Validators.lengthGreaterEqual(3)])}
	       children = {Components.Text} 
	  />
	  <p>start</p>
	  <p>end</p>
	  <form.Field name="description" children={Components.Text} /> 
	  <form.Field name="notable_link" children={Components.Text} validators={Validators.isHyperlink()} />
	  <p>accessability</p>
	  <p>allergens</p>
	  <p>signups allowed</p>
	  <form.Field 
	       name="event_capacity" 
	       validators={Validators.compose([Validators.isInt(), Validators.isPositive()])}
	       children={Components.Number}
	  />
	  <p>event capacity</p>
	  <p>background image</p>
	  {<Components.Submit form={form} text="Submit" />}
     </form>
}
