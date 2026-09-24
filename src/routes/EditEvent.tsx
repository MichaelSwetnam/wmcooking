import { useForm } from "@tanstack/react-form"
import Validators from "../components/Input/Validators";
import Components from "../components/Input/InputComponents";

export default function EditEvent() {
     const form = useForm({
	  defaultValues: {
	       title: '',
	       location: '',
	       start_date: '',
	       end_date: '',
	       description: '',
	       notable_link: '',
	       accessability: '',
	       allergens: '',
	       allows_signups: '',
	       event_capacity: '',
	       background_image: ''
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
	  <form.Field
	       name="start_date"
	       validators={Validators.compose([Validators.required(), Validators.isDateAfter(new Date())])}
	       children={Components.DateTime}
	  />
	  <form.Field
	       name="end_date"
	       validators={Validators.compose([Validators.required(), Validators.isDateAfter(new Date())])}
	       children={Components.DateTime}
	  />
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
