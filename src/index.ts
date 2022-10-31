import { Q, type Database, type Model } from "@nozbe/watermelondb";

let __db: Database;

export function builder_WatermelonDB_set_database(db: Database) {
  __db = db;
}

type BuilderModel = typeof Model;
type WithBuild = {
  model: BuilderModel;
  as?: string;
  with?: WithBuild[];
};
type LevelModelType = { parent: BuilderModel; model: BuilderModel; as: string };
type RawType = Record<string, any>;

export class Builder {
  private _withLevels = new Map<string, LevelModelType>();
  private _with: WithBuild[] = [];

  constructor(private model: typeof Model) {
    if (!__db) {
      throw new Error(
        "ERRO: Vincular database função builder_WatermelonDB_set_database(db)"
      );
    }
  }

  public with(associations: WithBuild[]) {
    if (this._with.length) {
      throw new Error("Somente uma chamada do método with é permitido");
    }
    this._with.push(
      ...(Array.isArray(associations) ? associations : [associations])
    );
    return this;
  }

  public async get<K = RawType>(id: string): Promise<K | null> {
    let _data: RawType[] = [];
    const data = await __db.get(this.model.table).find(id);
    if (data) {
      _data = await this._process([data]);
      return _data[0] as K;
    }
    return null;
  }

  public async all<K = RawType[]>(
    conditions?: Q.Clause[]
  ): Promise<K[] | null> {
    let _data = [];
    const data = await __db
      .get(this.model.table)
      .query(...(conditions || []))
      .fetch();
    if (data) {
      _data = await this._process(data);
      return _data as K[];
    }
    return null;
  }

  private _concat(value: string, value_concat: string) {
    return `${value}${value ? "." : ""}${value_concat}`;
  }

  private _makeWithLevels(
    associations: WithBuild[],
    parent: BuilderModel,
    concat = ""
  ) {
    for (let { model, with: w = [], as: as } of associations) {
      const _concat = this._concat(concat, model.table);
      this._withLevels.set(_concat, { parent, model, as: as || model.table });
      if (w.length) {
        this._makeWithLevels(w, model, _concat);
      }
    }
  }

  private async _process(models: Model[]) {
    let list = models.length ? models.map((m) => m._raw as RawType) : [];

    this._withLevels.clear();
    this._makeWithLevels(this._with, this.model, "");

    let level = 1;
    let columns = this._getAllColumnsByLevel(level);
    while (columns) {
      list = await this._getAllIdFrom(list, columns);
      level += 1;
      columns = this._getAllColumnsByLevel(level);
    }

    return list;
  }

  private _getValueFromPath(path: string, key: string, raw: RawType) {
    const keys = path.split(".");
    if (keys.length > 1) {
      const full_keys = keys.slice(0, -1);
      let i = 0;
      const values: string[] = [];
      const init = raw;
      while (i < full_keys.length) {
        const ids: string[] = Array.isArray(init[full_keys[i]])
          ? init[full_keys[i]].map((item_raw: RawType) =>
              this._getValueFromPath(
                full_keys.slice(i + 1).join("."),
                key,
                item_raw
              )
            )
          : [init[full_keys[i]]];
        ids.forEach((id) => {
          values.push(...(Array.isArray(id) ? id : [id]));
        });
        i += 1;
      }

      return values;
    }
    return [raw[key]];
  }

  private _setValueFromPath(
    path: string,
    table: string,
    key: string,
    type: "belongs_to" | "has_many",
    raw: RawType,
    listValues: RawType[]
  ) {
    const keys = path.split(".");
    if (keys.length > 1) {
      const full_keys = keys.slice(0, -1);
      let i = 0;
      const init = raw;
      while (i < full_keys.length) {
        if (Array.isArray(init[full_keys[i]])) {
          init[full_keys[i]].map((item_raw: RawType) =>
            this._setValueFromPath(
              full_keys.slice(i + 1).join("."),
              table,
              key,
              type,
              item_raw,
              listValues
            )
          );
        } else {
          if (type === "has_many") {
            init[table] = listValues.filter((m) => m[key] === raw["id"]);
          } else {
            init[table] = listValues.find((m) => m["id"] === raw[key]);
          }
        }
        i += 1;
      }

      return;
    }
    if (type === "has_many") {
      raw[table] = listValues.filter((m) => m[key] === raw["id"]);
    } else {
      raw[table] = listValues.find((m) => m["id"] === raw[key]);
    }
  }

  private _getAllColumnsByLevel(level: number) {
    const columns: Record<string, LevelModelType> = {};
    this._withLevels.forEach((value, key) => {
      if (key.split(".").length === level) {
        columns[key] = value;
      }
    });
    return Object.keys(columns).length ? columns : null;
  }

  private async _getAllIdFrom(
    list: Array<RawType>,
    columns: Record<string, LevelModelType>
  ) {
    const keys = Object.keys(columns);
    const data: Record<
      string,
      {
        values: string[];
        type: "belongs_to" | "has_many";
        id: string;
        models: LevelModelType;
        dataModels?: Array<RawType>;
      }
    > = {};

    keys.forEach((key) => {
      const listKey = key.split(".");
      const table = listKey[listKey.length - 1];
      const models = columns[key];
      const associations = models.parent.associations;
      const associationKey =
        Object.keys(associations).find(
          (association) => association === table
        ) || "";
      const association = associations[associationKey];
      if (association) {
        let id = "";
        const type = association.type;
        switch (association.type) {
          case "belongs_to":
            id = association.key;
            break;
          case "has_many":
            id = association.foreignKey;
            break;
        }
        data[key] = {
          models,
          values: [],
          type,
          id,
        };
      }
    });

    list.forEach((raw) => {
      keys.forEach((key) => {
        if (Object.keys(data).includes(key)) {
          const { id, type, values } = data[key];
          const _id = type === "belongs_to" ? id : "id";
          let idValues = this._getValueFromPath(key, _id, raw);
          idValues.forEach((idValue) => {
            if (!values.includes(idValue)) {
              values.push(idValue);
            }
          });
        }
      });
    });
    const keysData = Object.keys(data);
    for (let key of keysData) {
      if (Object.keys(data).includes(key)) {
        const { models, id, type, values } = data[key];
        const modelData =
          (
            await __db
              .get(models.model.table)
              .query(
                Q.where(type === "belongs_to" ? "id" : id, Q.oneOf(values))
              )
              .fetch()
          )?.map((m) => m._raw) || [];

        if (modelData.length) {
          const table = models.as;
          list.forEach((raw) => {
            this._setValueFromPath(key, table, id, type, raw, modelData);
          });
        }
      }
    }

    return list;
  }
}
