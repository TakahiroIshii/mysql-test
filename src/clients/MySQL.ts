import { createConnection, getConnection, Repository } from "typeorm";
import { config } from "../../configs";
import * as Entities from "../entities";
import { singleton } from "tsyringe";

@singleton()
export class MySQL {
  async initSQL() {
    const entities = Object.values(Entities);
    return await createConnection({
      entities,
      ...config.mySQL,
    });
  }

  async close() {
    await getConnection().close();
  }

  getRepository = <T>(Entity: new () => T): Repository<T> =>
    getConnection().getRepository(Entity);
}
