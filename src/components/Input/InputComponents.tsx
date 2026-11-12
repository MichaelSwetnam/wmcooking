import type { AnyFieldApi } from "@tanstack/react-form";
import { TextInput } from "./Components/Text";
import { TextAreaInput } from "./Components/TextArea";
import { NumberInput } from "./Components/Number";
import { DateTimeInput } from "./Components/DateTime";
import { Checkbox } from "./Components/Checkbox";
import { SubmitButton } from "./Components/Submit";
import { Selector, type SelectorOption } from "./Components/Selector";
import { AllergySelectorInput } from "./Components/AllergenSelector";

const Components = {
     Text: () => (field: AnyFieldApi) => <TextInput field={field} />,
     TextArea: () => (field: AnyFieldApi) => <TextAreaInput field={field} />,
     Number: () => (field: AnyFieldApi) => <NumberInput field={field} />,
     DateTime: () => (field: AnyFieldApi) => <DateTimeInput field={field} />,
     Checkbox: () => (field: AnyFieldApi) => <Checkbox field={field} />,
     Allergens: (startSelected?: string[]) => (field: AnyFieldApi) => <AllergySelectorInput field={field} startSelected={startSelected} />,

     Selector: (options: SelectorOption[]) => (field: AnyFieldApi) => <Selector field={field} options={options} />,
     Submit: SubmitButton
}

export default Components;
