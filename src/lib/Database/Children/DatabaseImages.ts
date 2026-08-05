import type { PostgrestError } from "@supabase/supabase-js";
import { Supabase } from "../../Supabase";
import type { DBWrapper } from "../Database";
import DBReturn from "../DBReturn";
import DatabaseChild from "./DatabaseChild";

type FileObject = {
    name: string,
    id: string,
    updated_at: string
};

const PREFIX = "https://ysqrkscfqagmvjdglxcb.supabase.co/storage/v1/object/public/Images/";

/**
 * Database images don't cache in localStorage, but they will keep data between page navigation.
 */
export default class DatabaseImages extends DatabaseChild {
    readonly files: string[] = [];
    loaded = false;    
        
    constructor(db: DBWrapper) {
        super(db);
    }

    async get(): Promise<DBReturn<string[]>> {
        if (this.loaded) return new DBReturn(this.files);
       
        //
        let { data, error } = await Supabase
            .storage
            .from('Images')
            .list(undefined, {
                limit: 20,
                offset: 0,
            }
        );
        
        const ret = DBReturn.fromSupabase<FileObject[]>(data, error as unknown as PostgrestError);
        if (ret.isError()) return ret.mapError();

        const mappedRet = ret.map(data => {
            return data.map(t => PREFIX + t.name);
        });

        return mappedRet;  
    }

    toCacheObject(): unknown {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateFromCache(_s: unknown): void {
        throw new Error("Method not implemented.");
    }
}
