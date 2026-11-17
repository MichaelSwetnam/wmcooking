import type { AnyFieldApi } from "@tanstack/react-form";
import { TextInput } from "./Components/Text";
import { TextAreaInput } from "./Components/TextArea";
import { NumberInput } from "./Components/Number";
import { DateTimeInput } from "./Components/DateTime";
import { Checkbox } from "./Components/Checkbox";
import { SubmitButton } from "./Components/Submit";
import { Selector, type SelectorOption } from "./Components/Selector";
import { AllergySelectorInput } from "./Components/AllergenSelector";
import { BackgroundLinkSelector } from "./Components/BackgroundLinkSelector";
import { TextInputDisabled } from "./Components/TextDisabled";

const Components = {
     Text: () => (field: AnyFieldApi) => <TextInput field={field} />,
     TextDisabled: () => (field: AnyFieldApi) => <TextInputDisabled field={field} />,
     TextArea: () => (field: AnyFieldApi) => <TextAreaInput field={field} />,
     Number: () => (field: AnyFieldApi) => <NumberInput field={field} />,
     DateTime: () => (field: AnyFieldApi) => <DateTimeInput field={field} />,
     Checkbox: () => (field: AnyFieldApi) => <Checkbox field={field} />,
     Allergens: () => (field: AnyFieldApi) => <AllergySelectorInput field={field} />,
     BackgroundSelector: () => (field: AnyFieldApi) => <BackgroundLinkSelector field={field} />,

     Selector: (options: SelectorOption[]) => (field: AnyFieldApi) => <Selector field={field} options={options} />,
     Submit: SubmitButton
}

export default Components;
