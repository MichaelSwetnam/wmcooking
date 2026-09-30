import { useForm } from "@tanstack/react-form"
import Validators, { InputValidatorBuilder } from "../components/Input/Validators";
import Components from "../components/Input/InputComponents";

const defaultValues = {
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
};
type DV = typeof defaultValues;
export default function EditEvent() {
     const form = useForm({
	  defaultValues,
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
	       validators={InputValidatorBuilder.Single<DV>(Validators.required())}
	       children = {Components.Text} 
	  />
	  <form.Field
	       name="location"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .add(Validators.required())
		    .add(Validators.lengthGreaterEqual(3))
		    .build()
	       }
	       children = {Components.Text} 
	  />
	  <form.Field
	       name="start_date"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .add(Validators.required())
		    .add(Validators.isDateAfter(new Date()))
		    .build()
	       }
	       children={Components.DateTime}
	  />
	  <form.Field
	       name="end_date"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .addListenTarget("start_date")
		    .add(Validators.required())
		    .add(({ value, fieldApi }) => {
			 const startTs = Date.parse(fieldApi.form.getFieldValue("start_date"));
			 if (isNaN(startTs)) return 'Must be after the start time.';
			 const start = new Date(startTs);

			 let isAfter = Validators.isDateAfter(start)({ value });
			 return isAfter;
		    })
		    .build()
	       }
	       children={Components.DateTime}
	  />
	  <form.Field 
	       name="description"
	       children={Components.Text}
	       validators={InputValidatorBuilder.Single<DV>(Validators.required())}
	  /> 
	  <form.Field name="notable_link"
	       children={Components.Text}
	       validators={InputValidatorBuilder.Single<DV>(Validators.isHyperlink())}/>
	  <form.Field
	       name="accessability"
	       children={Components.Selector}

	       validators={InputValidatorBuilder.Single<DV>(({value}) => {
		    console.log(value);
		    return undefined;
	       })}
	  />
	  <p>accessability</p>
	  <p>allergens</p>
	  <p>signups allowed</p>
	  <form.Field 
	       name="event_capacity" 
	       validators={
		    new InputValidatorBuilder<DV>()
		    .add(Validators.isInt())
		    .add(Validators.isPositive())
		    .build()
	       }
	       children={Components.Number}
	  />
	  <p>event capacity</p>
	  <p>background image</p>
	  {<Components.Submit form={form} text="Submit" />}
     </form>
}
