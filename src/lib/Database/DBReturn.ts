import { FunctionsHttpError, type PostgrestError } from "@supabase/supabase-js";
import DBError from "./DBError";

export default class DBReturn<T> {
    private value: DBError | T;

    constructor(value: DBError | T) {
        this.value = value;
    }
    
    public static customError(error: string): DBReturn<never> {
        return new DBReturn<never>(DBError.custom(error));
    }

    public static fromError<T>(error: DBError): DBReturn<T> {
        return new DBReturn<T>(error);
    }
    
    public static async fromSupabaseFunction<T>(data: T | null, error: PostgrestError | null): Promise<DBReturn<T>> {
        if (!data && error && error instanceof FunctionsHttpError) {    
            const errorMessage = await error.context.json();
            return DBReturn.customError(errorMessage.message);
        }

        return DBReturn.fromSupabase(data, error);
    }

    public static fromSupabase<T>(data: T | null, error: PostgrestError | null): DBReturn<T> {
        if (!data || error)
            return new DBReturn<T>(DBError.build(error));
        
        return new DBReturn(data);
    }

    public static all<T>(arr: DBReturn<T>[]): DBReturn<T[]> {
        const anyFailed = arr.find(r => r.isError());
        if (anyFailed) return DBReturn.fromError(anyFailed.unwrapError());

        // Since none failed, I know they are all T[]
        return new DBReturn(arr.map(x => x.value) as T[]);
    }

    public unwrapError(): DBError {
        if (this.isError()) return this.value as DBError;
        else throw Error("Unwrapped a data object as error");
    }

    public unwrapData() {
        if (this.isData()) return this.value as T;
        else throw Error("Unwrapped an error object as data");
    }

    public isError(): boolean {
        return this.value instanceof DBError;
    }

    public isData(): this is T {
        return !this.isError();
    }

    public map<U>(transformer: (v: T) => U): DBReturn<U> {
        if (this.isError()) 
            return DBReturn.fromError<U>(this.unwrapError());

        return new DBReturn(transformer(this.unwrapData()));
    }

    public mapError<U>(): DBReturn<U> {
        if (this.isData())
            throw new Error("MapError must received an Error. Found data");

        return new DBReturn<U>(this.unwrapError());
    }

    public ifData(cb: (d: T) => unknown): DBReturn<T> {
        if (this.isData()) cb(this.unwrapData());
        return this;
    }

    public ifError(cb: (d: DBError) => unknown): DBReturn<T> {
        if (this.isError()) cb(this.unwrapError());

        return this;
    }
}