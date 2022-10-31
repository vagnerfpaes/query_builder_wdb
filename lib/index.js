"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = exports.builder_WatermelonDB_set_database = void 0;
const watermelondb_1 = require("@nozbe/watermelondb");
let __db;
function builder_WatermelonDB_set_database(db) {
    __db = db;
}
exports.builder_WatermelonDB_set_database = builder_WatermelonDB_set_database;
class Builder {
    constructor(model) {
        this.model = model;
        this._withLevels = new Map();
        this._with = [];
        if (!__db) {
            throw new Error("ERRO: Vincular database função builder_WatermelonDB_set_database(db)");
        }
    }
    with(associations) {
        if (this._with.length) {
            throw new Error("Somente uma chamada do método with é permitido");
        }
        this._with.push(...(Array.isArray(associations) ? associations : [associations]));
        return this;
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let _data = [];
            const data = yield __db.get(this.model.table).find(id);
            if (data) {
                _data = yield this._process([data]);
                return _data[0];
            }
            return null;
        });
    }
    all(conditions) {
        return __awaiter(this, void 0, void 0, function* () {
            let _data = [];
            const data = yield __db
                .get(this.model.table)
                .query(...(conditions || []))
                .fetch();
            if (data) {
                _data = yield this._process(data);
                return _data;
            }
            return null;
        });
    }
    _concat(value, value_concat) {
        return `${value}${value ? "." : ""}${value_concat}`;
    }
    _makeWithLevels(associations, parent, concat = "") {
        for (let { model, with: w = [], as: as } of associations) {
            const _concat = this._concat(concat, model.table);
            this._withLevels.set(_concat, { parent, model, as: as || model.table });
            if (w.length) {
                this._makeWithLevels(w, model, _concat);
            }
        }
    }
    _process(models) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = models.length ? models.map((m) => m._raw) : [];
            this._withLevels.clear();
            this._makeWithLevels(this._with, this.model, "");
            let level = 1;
            let columns = this._getAllColumnsByLevel(level);
            while (columns) {
                list = yield this._getAllIdFrom(list, columns);
                level += 1;
                columns = this._getAllColumnsByLevel(level);
            }
            return list;
        });
    }
    _getValueFromPath(path, key, raw) {
        const keys = path.split(".");
        if (keys.length > 1) {
            const full_keys = keys.slice(0, -1);
            let i = 0;
            const values = [];
            const init = raw;
            while (i < full_keys.length) {
                const ids = Array.isArray(init[full_keys[i]])
                    ? init[full_keys[i]].map((item_raw) => this._getValueFromPath(full_keys.slice(i + 1).join("."), key, item_raw))
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
    _setValueFromPath(path, table, key, type, raw, listValues) {
        const keys = path.split(".");
        if (keys.length > 1) {
            const full_keys = keys.slice(0, -1);
            let i = 0;
            const init = raw;
            while (i < full_keys.length) {
                if (Array.isArray(init[full_keys[i]])) {
                    init[full_keys[i]].map((item_raw) => this._setValueFromPath(full_keys.slice(i + 1).join("."), table, key, type, item_raw, listValues));
                }
                else {
                    if (type === "has_many") {
                        init[table] = listValues.filter((m) => m[key] === raw["id"]);
                    }
                    else {
                        init[table] = listValues.find((m) => m["id"] === raw[key]);
                    }
                }
                i += 1;
            }
            return;
        }
        if (type === "has_many") {
            raw[table] = listValues.filter((m) => m[key] === raw["id"]);
        }
        else {
            raw[table] = listValues.find((m) => m["id"] === raw[key]);
        }
    }
    _getAllColumnsByLevel(level) {
        const columns = {};
        this._withLevels.forEach((value, key) => {
            if (key.split(".").length === level) {
                columns[key] = value;
            }
        });
        return Object.keys(columns).length ? columns : null;
    }
    _getAllIdFrom(list, columns) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(columns);
            const data = {};
            keys.forEach((key) => {
                const listKey = key.split(".");
                const table = listKey[listKey.length - 1];
                const models = columns[key];
                const associations = models.parent.associations;
                const associationKey = Object.keys(associations).find((association) => association === table) || "";
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
                    const modelData = ((_a = (yield __db
                        .get(models.model.table)
                        .query(watermelondb_1.Q.where(type === "belongs_to" ? "id" : id, watermelondb_1.Q.oneOf(values)))
                        .fetch())) === null || _a === void 0 ? void 0 : _a.map((m) => m._raw)) || [];
                    if (modelData.length) {
                        const table = models.as;
                        list.forEach((raw) => {
                            this._setValueFromPath(key, table, id, type, raw, modelData);
                        });
                    }
                }
            }
            return list;
        });
    }
}
exports.Builder = Builder;
