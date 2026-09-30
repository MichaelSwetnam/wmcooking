import type { AnyFieldApi } from "@tanstack/react-form";

type ValidatorProp = { value: string, fieldApi: AnyFieldApi };
type ValidatorFn = (_: ValidatorProp) => string | undefined;

/** Note! This builder class is NOT immutable. Function chaining is only for convenience. */
export class InputValidatorBuilder<T extends {[_: string]: string}> {
     validators: ValidatorFn[] = [];
     onChangeListenTo: (keyof T)[] | undefined;

     static Single<K extends {[_: string]: string}>(fn: ValidatorFn, listenTo?: string[]) {
	  const b = new InputValidatorBuilder<K>();
	  b.addValidator(fn);
	  if (listenTo) b.addListenTargets(listenTo);
	  return b.build();
     }

     constructor() {}

     addListenTarget(target: keyof T): InputValidatorBuilder<T> {
	  if (!this.onChangeListenTo) this.onChangeListenTo = [];
	  this.onChangeListenTo.push(target);
	  return this;
     }

     addListenTargets(target: (keyof T)[]): InputValidatorBuilder<T> {
	  target.forEach(t => this.addListenTarget(t));
	  return this;
     }

     /** Convenience function which mirrors functionality of addValidator */
     add = this.addValidator;
     addValidator(fn: ValidatorFn): InputValidatorBuilder<T> {
	  this.validators.push(fn);
	  return this;
     }

     build() {
	  return {
	       onChangeListenTo: this.onChangeListenTo,
	       onChange: (prop: ValidatorProp) => {
		    for (const fn of this.validators) {
			 let result: string | undefined;
			 if (result = fn(prop)) return result;
		    }
		    return undefined;
	       }
	  }
     }
}

const Validators = {
     // Generic
     required: () => ({value}) => !value ? 'This field is required.' : undefined,
    
     // String 
     lengthGreaterEqual: (x: number) => ({value}) => value &&
	  (value.length <= x ? `This field must contain ${x} or more characters.` : undefined ),

     isHyperlink: () => ({ value }) => {
	  if (!value) return undefined;
	  try {
	       // This is not the best method ever but it will work for now!
	       new URL(value)
	       return undefined; // Was a valid link
	  } catch (e) {
	     if (e instanceof TypeError) return 'This field must be a valid URL.'
	       throw e;
	  }
     },

     // lengthGreater: (x: number) => Validators.lengthGreaterEqual(x+1),

     // Numeric
     // Text input does not return a value unless it is a valid number apparently.
     // isNumber: () => onChangeComp(({value}) => value && (isNaN(parseInt(value)) ? 'This field must be a number.' : undefined )),
     isInt: () => ({ value }) => {
	  if (!value) undefined; 
	  const num = parseFloat(value);
	  if (isNaN(num)) return 'This field must contain a valid number.'; 
	  if (Math.ceil(num) !== num) return 'This field must contain a whole number (no decimal component)';
	  return undefined;
     },
     isGreaterThan: (x: number) => ({ value }) => {
	  if (!value) return undefined; 
	  const num = parseFloat(value);
	  if (isNaN(num)) return 'This field must contain a valid number.'; 
	  if (num <= x) return `This field must contain a number greater than ${x}`;
	  return undefined;
     },
     isPositive: () => Validators.isGreaterThan(0),

     // DateTime
     isDateAfter: (time: Date) => ({ value: valueStr }) => {
	  const valueTs = Date.parse(valueStr);
	  if (isNaN(valueTs)) return 'Invalid date.';

	  const value = new Date(valueTs);

	  if (value <= time) return `Must be after ${time.toLocaleString()}.`;
	  return undefined;
     },
};

export default Validators;
