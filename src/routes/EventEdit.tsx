import { useParams } from "react-router-dom";
import RequireAdminLogin from "../components/Auth/RequireAdminLogin";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";

function FieldInfo({ field }: { field: AnyFieldApi }) {
     return (
       <>
	 {field.state.meta.isTouched && !field.state.meta.isValid ? (
	   <em>{field.state.meta.errors.join(',')}</em>
	 ) : null}
	 {field.state.meta.isValidating ? 'Validating...' : null}
       </>
     )
}

export default function Page() {
     const { id: eventId } = useParams();
     const form = useForm({
	  defaultValues: {
	       title: '',
	       location: '',
	       // start
	       // end
	       description: '',
	       notable_link: '',
	       // accessability
	       // allergens
	       // ...
	  },
	  onSubmit: async ({ value }) => {
	       console.log(value);
	  }
     });

     return <RequireAdminLogin>
	  <div className="flex flex-col" >
	       <h1>Hello! {eventId}</h1>
	       <form.Field
		    name="title"
		    validators = {{
			 onChange: ({ value }) => {
			      if (!value) return "A title is required";
			      if (value.length < 3) return "Event title should be at least 3 characters.";
			      return undefined;
			 }
		    }}
		    children = {field => {
			 return <>
			      <label htmlFor={field.name}>First Name:</label>
			      <input
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
	  </div>
     </RequireAdminLogin>
}
