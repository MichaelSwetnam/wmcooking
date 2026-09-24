
type ValidatorProp = { value: string };
type ValidatorFn = (_: ValidatorProp) => string | undefined;

const onChangeComp = (fn: ValidatorFn) => ({ onChange: (prop: ValidatorProp) => fn(prop) });
const Validators = {
     // Generic
     required: () => onChangeComp(({value}) => !value ? 'This field is required.' : undefined ),
     
     // String 
     lengthGreaterEqual: (x: number) => onChangeComp(({value}) => value &&
	  (value.length <= x ? `This field must contain ${x} or more characters.` : undefined ) ),

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

     // DateTime
     isDateAfter: (time: Date) => onChangeComp(({ value }) => {
	  const date = new Date(value);
	  throw new Error("Not implemented!");
     }),


     // For now, only onChange is supported. 
     compose(fns: { onChange: ValidatorFn }[]) {
	  return {
	       onChange: (prop: ValidatorProp) => {
		    console.log(prop.value);
		    for (const fn of fns) {
			 let result: string | undefined;
			 if (result = fn.onChange(prop)) return result;
		    }
		    return undefined;
	       }
	  }
     }
};

export default Validators;
