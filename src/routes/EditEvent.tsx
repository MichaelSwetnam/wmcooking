import { useForm } from "@tanstack/react-form"
import type { AnyFieldApi, FieldApi } from "@tanstack/react-form";

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500 font-semibold">{field.state.meta.errors.join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

function Label({ content }: { content: string }) {
     return <label className="font-semibold text-gray-500">{content}</label> 
}

export default function EditEvent() {
     const form = useForm({
	  defaultValues: {
	       title: '',
	       location: '',
	  },
	  onSubmit: async ({ value }) => alert(JSON.stringify(value))
     });
     
     return <div className="flex flex-col items-center">
	  <form
	       className="w-full flex flex-col gap-3 md:grid md:grid-cols-[1fr_4fr] md:items-center lg:w-3/4"
	       onSubmit={e => {
		    e.preventDefault();
		    e.stopPropagation();
		    form.handleSubmit();
	       }}
	  >
	       <form.Field
		    name="title"
		    validators={{
			 onChange: ({ value }) => !value ? 'A title is required' : undefined
		    }}
		    children = {field => {
			 return <>
			      <Label content="Title:" />
			      <input 
				   className="bg-white p-1 rounded-sm shadow-sm w-full text-center"
				   id={field.name}
				   name={field.name}
				   value={field.state.value}
				   onBlur={field.handleBlur}
				   onChange={e => field.handleChange(e.target.value)}
			      />
			      <FieldInfo field={field} />
			 </>
		    }}
	       />
	  </form>
     </div>

}
