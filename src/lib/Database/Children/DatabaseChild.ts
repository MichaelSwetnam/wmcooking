import type { DBWrapper } from "../Database";

export default abstract class DatabaseChild {
    protected readonly db: DBWrapper

    constructor(db: DBWrapper) {
        this.db = db;
    }

    abstract toCacheObject(): unknown;
    abstract updateFromCache(s: unknown): void;
}