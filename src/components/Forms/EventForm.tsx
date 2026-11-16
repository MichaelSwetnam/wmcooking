import { useForm } from "@tanstack/react-form"
import { type CookingEventData } from "../../lib/CookingEvent";
import Validators, { InputValidatorBuilder } from "../Input/Validators";
import Components from "../Input/InputComponents";

type DV = { event: CookingEventData, allergens: string[] };
type SubmitFx = (a: DV) => void;

export function EventForm({eventData, allergens, onSubmit }: { eventData: CookingEventData, allergens: string[], onSubmit: SubmitFx}) {
     const form = useForm({
	  defaultValues: { event: eventData, allergens: allergens }, 
	  // onSubmit will have extra field: allergens
	  onSubmit: ({ value }) => {
	       onSubmit(value);
	  }
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
	       name="event.name"
	       validators={InputValidatorBuilder.Single<DV>(Validators.required())}
	       children = {Components.Text()} 
	  />
	  <form.Field
	       name="event.location"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .add(Validators.required())
		    .add(Validators.lengthGreaterEqual(3))
		    .build()
	       }
	       children = {Components.Text()} 
	  />
	  <form.Field
	       name="event.start_timestamp"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .add(Validators.required())
		    .add(Validators.isDateAfter(new Date()))
		    .build()
	       }
	       children={Components.DateTime()}
	  />
	  <form.Field
	       name="event.end_timestamp"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .addListenTarget("event.start_timestamp")
		    .add(Validators.required())
		    .add(({ value, fieldApi }) => {
			 const startTs = Date.parse(fieldApi.form.getFieldValue("event.start_timestamp"));
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
	       name="event.description"
	       children={Components.TextArea()}
	       validators={InputValidatorBuilder.Single<DV>(Validators.required())}
	  /> 
	  <form.Field name="event.notable_link"
	       children={Components.Text()}
	       validators={InputValidatorBuilder.Single<DV>(Validators.isHyperlink())}/>
	  <form.Field
	       name="event.accessability"
	       children={Components.Selector([ { val: "ClubMembers", display: "Club Members" }, { val: "AllStudents", display: "All Students" } ])}
	       validators={InputValidatorBuilder.Single<DV>(Validators.required())}
	   />

	  <form.Field
	       name="allergens"
	       children={Components.Allergens()}
	  />

	  <form.Field
	       name="event.requires_signup"
	       children={Components.Checkbox()}
	  />

	  <form.Subscribe 
	       selector={state => state.values.event.requires_signup}
	       children={allows_signups => {
		    if (!allows_signups) return null;

		    return <form.Field
			 name="capacity"
			 children={Components.Number()}
			 validators={new InputValidatorBuilder<DV>().add(Validators.required()).build()}
		    />

	       }}
	  />

	  <form.Field
	       name="event.background_image"
	       children={Components.BackgroundSelector()}
	  />

	  {<Components.Submit form={form} text="Submit" />}
     </form>
}
