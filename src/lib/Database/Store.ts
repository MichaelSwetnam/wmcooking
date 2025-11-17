import DBReturn from "./DBReturn";
import getMillis from "./getMillis";

type StoreValue<T> = {
    livesUntil: number;
    data: T;
};

type StoreGetter<T> = (id: string) => Promise<DBReturn<T>>;
export default class Store<T> {
    private static readonly INVALID_AFTER = 10 * 60 * 1000; // Miliseconds

    private readonly storageKey: string;
    private readonly fetch: StoreGetter<T>;
    private readonly data = new Map<string, StoreValue<T>>();

    private constructor(fetch: StoreGetter<T>, storageKey: string) {
        this.fetch = fetch;
        this.storageKey = storageKey;
    }

    private wrapData(data: T): StoreValue<T> {
        return {
            data,
            livesUntil: getMillis() + Store.INVALID_AFTER
        };
    }

    set(id: string, val: T): void {
        this.data.set(id, this.wrapData(val));
        this.save();
    }

    async get(id: string): Promise<DBReturn<T>> {
        // Get from cache
        if (this.data.has(id)) {
            const cached = this.data.get(id)!;
            if (cached.livesUntil > getMillis()) return new DBReturn(cached.data);
            else { // Data has lived for two long in the cache
                this.data.delete(id);
            }
        }

        // Grab from fetch method
        const fetched = await this.fetch(id);
        if (fetched.isError())
            return fetched;

        // Put into cache
        const data = fetched.unwrapData();
        this.data.set(id, this.wrapData(data));
        this.save();
        return new DBReturn(data);
    }

    private toStorable(): string {
        const obj: Partial<{[_: string]: StoreValue<T>}>= { };

        this.data.forEach((value, key) => {
            obj[key] = value;
        });

        return JSON.stringify(obj);
    }

    private save() {
        localStorage.setItem(this.storageKey, this.toStorable());
    }

    static fromStorage<T>(storageKey: string, fetch: StoreGetter<T>): Store<T> {
        const stored = localStorage.getItem(storageKey);
        const store = new Store<T>(fetch, storageKey);

        if (!stored) {
            return store; // Return empty store
        }

        const obj = JSON.parse(stored); 
        
        for (const key of Object.keys(obj)) {
            if (!obj[key]) continue;

            const val = obj[key] as StoreValue<T>;
            if (val.livesUntil < getMillis()) continue;

            store.data.set(key, val);
        }
        return store;
    }
}

