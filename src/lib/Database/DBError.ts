import type { PostgrestError } from "@supabase/supabase-js";

export default class DBError {
    error = true;
    message: string;

    private constructor(message: string) {
        this.message = message;
    }
    static build(error: PostgrestError | null) {
        if (error) return new DBError(error.message);
        else return new DBError("Did not receive expected data from database.");
    }

    static custom(message: string) {
        return new DBError(message);
    }
}
