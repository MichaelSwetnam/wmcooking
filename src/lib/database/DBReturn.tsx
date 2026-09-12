import type { PostgrestError } from "@supabase/supabase-js";
import ErrorComponent from "../../components/Utility/ErrorComponent";

class InvalidUnwrapError extends Error { 
    constructor() {
        super()
    }
}

type ErrorData = { message: string };
export class DBReturn<T> {
    static fromError<T>(error: ErrorData) {
        return new DBReturn<T>(undefined, error);
    }

    static fromData<T>(data: T) {
        return new DBReturn(data, undefined);
    }

    static FromDB<T>(data: T | null, error: PostgrestError | null): DBReturn<T> {
        if (error)
            return DBReturn.fromError({ message: error.message })

        if (!data) 
            return DBReturn.fromError({ message: "No data was provided." })
        
        return DBReturn.fromData(data);
    }

    private data?: T;
    private error?: ErrorData;
    private constructor(data?: T, error?: ErrorData) {
        this.data = data;
        this.error = error;
    }

    map<O>(cb: (data: T) => O): DBReturn<O> {
        if (this.error)
            return new DBReturn<O>(undefined, this.error);

        if (!this.data) throw new Error("Unreachable");
        return new DBReturn(cb(this.data), undefined);
    }

    splitArr(
        this: T extends unknown[] ? DBReturn<T> : never 
    ): T extends unknown[] ? DBReturn<T[number]>[] : never {
        throw new Error();
    }

    isData() {
        return !!this.data;
    }

    isError() {
        return !this.isData();
    }

    getData() {
        if (!this.data) throw new InvalidUnwrapError();
        return this.data;
    }

    getErrorJSX() {
        if (!this.error) throw new InvalidUnwrapError();

        return <ErrorComponent message={this.error.message} reveal={false} />
    }
}