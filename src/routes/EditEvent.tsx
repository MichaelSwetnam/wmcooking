import { useForm } from "@tanstack/react-form"
import Validators, { InputValidatorBuilder } from "../components/Input/Validators";
import Components from "../components/Input/InputComponents";
import { useParams } from "react-router-dom";
import ErrorComponent from "../components/Utility/ErrorComponent";
import { useCookingEvent, type EventFormData } from "../lib/CookingEvent";
import LoadingComponent from "../components/Utility/LoadingComponent";

type DV = EventFormData; 
export default function EditEvent() {
     const { id } = useParams();

     if (!id) {
	return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router. Given: '${id}'`} />
     }

     const parsedId = parseInt(id);
     if (isNaN(parsedId)) {
	return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router with type number. Given: '${id}' which is NaN.`} />
     }

     const { data: event, isLoading, error } = useCookingEvent(parsedId);
     if (isLoading)
	return <LoadingComponent />

     if (error)
	return <ErrorComponent message="Could not find this event" technical={error.message}/>

     console.log(event);

     const form = useForm({
	  defaultValues: event.getFormData(),
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
	       children = {Components.Text()} 
	  />
	  <form.Field
	       name="location"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .add(Validators.required())
		    .add(Validators.lengthGreaterEqual(3))
		    .build()
	       }
	       children = {Components.Text()} 
	  />
	  <form.Field
	       name="start_date"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .add(Validators.required())
		    .add(Validators.isDateAfter(new Date()))
		    .build()
	       }
	       children={Components.DateTime()}
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
	       children={Components.DateTime()}
	  />
	  <form.Field 
	       name="description"
	       children={Components.Text()}
	       validators={InputValidatorBuilder.Single<DV>(Validators.required())}
	  /> 
	  <form.Field name="notable_link"
	       children={Components.Text()}
	       validators={InputValidatorBuilder.Single<DV>(Validators.isHyperlink())}/>
	  <form.Field
	       name="accessability"
	       children={Components.Selector([ { val: "ClubMembers", display: "Club Members" }, { val: "AllStudents", display: "All Students" } ])}
	       validators={InputValidatorBuilder.Single<DV>(Validators.required())}
	   />
	  <p>allergens</p>
	  <form.Field
	       name="allows_signups"
	       children={Components.Checkbox()}
	  />

	  <form.Subscribe 
	       selector={state => state.values.allows_signups}
	       children={allows_signups => {
		    if (!allows_signups) return null;

		    return <form.Field
			 name="event_capacity"
			 children={Components.Number()}
			 validators={new InputValidatorBuilder<DV>().add(Validators.required()).build()}
		    />

	       }}
	  />

	  <p>background image</p>
	  {<Components.Submit form={form} text="Submit" />}
     </form>
}
