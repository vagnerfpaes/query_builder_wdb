import { Q, type Database, type Model } from "@nozbe/watermelondb";
export declare function builder_WatermelonDB_set_database(db: Database): void;
declare type BuilderModel = typeof Model;
declare type WithBuild = {
    model: BuilderModel;
    as?: string;
    with?: WithBuild[];
};
declare type RawType = Record<string, any>;
export declare class Builder {
    private model;
    private _withLevels;
    private _with;
    constructor(model: typeof Model);
    with(associations: WithBuild[]): this;
    get<K = RawType>(id: string): Promise<K | null>;
    all<K = RawType[]>(conditions?: Q.Clause[]): Promise<K[] | null>;
    private _concat;
    private _makeWithLevels;
    private _process;
    private _getValueFromPath;
    private _setValueFromPath;
    private _getAllColumnsByLevel;
    private _getAllIdFrom;
}
export {};
