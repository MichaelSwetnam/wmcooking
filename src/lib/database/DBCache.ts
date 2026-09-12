import { DBReturn } from "./DBReturn";

interface DBEntry<T> {
    data: T,
    expires: Date
}

type FetchFunction<K extends number | string, T> = (id: K) => Promise<DBReturn<T>>;

const DEFAULT_VALID_LENGTH = 5 * 60; // in seconds
export default class Cache<K extends number | string, T> {
    private cache = new Map<K, DBEntry<T>>();
    private validLength: number;
    private fetchFx: FetchFunction<K, T>;

    constructor(fetchFx: FetchFunction<K, T>, validLength?: number) {
        this.validLength = validLength ?? DEFAULT_VALID_LENGTH; 
        this.fetchFx = fetchFx;      
    }

    private async fetch(key: K): Promise<DBReturn<T>> {
        const data = await this.fetchFx(key);
        if (data.isData())
            this.set(key, data.getData());

        return data;
    }

    async get(key: K): Promise<DBReturn<T>> {
        const entry = this.cache.get(key);
        if (!entry || entry.expires < new Date()) {
            return await this.fetch(key);
        };

        return DBReturn.fromData(entry.data);
    }

    set(key: K, data: T) {
        // Potentially overwriting is fine!
        const now = new Date();
        now.setSeconds(now.getSeconds() + this.validLength);
        
        this.cache.set(key, {
            data,
            expires: now
        });
    }

    find(fx: (data: T, key: K) => boolean): [K, T] | undefined {
        for (const [key, value] of this.cache) {
            if (fx(value.data, key)) {
                return [key, value.data];
            }
        }
    }
}