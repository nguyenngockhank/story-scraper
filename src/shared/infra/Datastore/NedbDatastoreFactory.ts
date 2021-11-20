import { Injectable } from "../../domain/AppContainer";
import * as Datastore from "nedb";
import { promisify } from "util";
import { MyDatastore } from "./MyDatastore";

export interface NedbDatastore<T> extends MyDatastore<T> {
  _nedb: Datastore<any>;
}

@Injectable()
export class NedbDatastoreFactory {
  create<T>(options: { path: string }): NedbDatastore<T> {
    // console.log(">>> create instance NedbDatastore", options, Datastore);
    const db = new Datastore({
      filename: options.path,
      autoload: true,
    });

    const instance = {
      insert: promisify(db.insert).bind(db),
      findMany: promisify(db.find).bind(db),
      findFirst: promisify(db.findOne).bind(db),
      findAll: (): Promise<any> => {
        return instance.findMany({});
      },
      _nedb: db,
    };
    return instance;
  }
}
