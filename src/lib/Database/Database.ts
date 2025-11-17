import DatabaseEvents from "./Children/DatabaseEvents";

export type DatabaseStorage = {
    events: {
        nextEvents: {
            d: number[];
            livesUntil: number;
        },
        months: {
            [_: string]: {
                d: number[],
                livesUntil: number
            }
        }
    };
};


export interface DBWrapper {
    save(): void;
}

class Database {
    private static readonly DATABASE_STORAGE_KEY = "DATABASE";
    public readonly events = new DatabaseEvents(this);

    constructor() {
        const dbStorage = localStorage.getItem(Database.DATABASE_STORAGE_KEY);
        if (dbStorage) {
            const obj = JSON.parse(dbStorage) as DatabaseStorage;
            if (obj.events)
                this.events.updateFromCache(obj.events);
        }
    }

    public save() {
        const obj: Partial<DatabaseStorage> = {};
        obj.events = this.events.toCacheObject();

        localStorage.setItem(Database.DATABASE_STORAGE_KEY, JSON.stringify(obj));

    }
}

export default new Database();