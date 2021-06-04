// import-sort-ignore
import "reflect-metadata";
import "source-map-support/register";

import * as fs from "fs";
import Aigle from "aigle";
import { Lifecycle, container, singleton } from "tsyringe";

import { config } from "../configs";
import path = require("path");
import { SqlServer } from "./SqlServer";
import { Router } from "./controllers/Router";
import { Logger, runAsync } from "./utils";
import { MySQL } from "./clients";

@singleton()
class Main {
  constructor(
    private readonly sqlServer: SqlServer,
    private readonly router: Router,
    private readonly mySQL: MySQL
  ) {}

  async initAll() {
    await this.mySQL.initSQL();
  }

  async listen() {
    this.router.init();
    await this.sqlServer.listen();
  }

  async close() {
    await this.mySQL.close();
    return await this.sqlServer.close();
  }
}

function readFiles(dirPath: string) {
  for (const fileName of fs.readdirSync(dirPath)) {
    const filePath = path.resolve(dirPath, fileName);
    if (fs.statSync(filePath).isDirectory()) {
      readFiles(filePath);
      continue;
    }
    if (/\.d\.ts/.test(filePath)) {
      continue;
    }
    if (/\.(js|ts)$/.test(filePath)) {
      require(filePath);
    }
  }
}

export async function initInstances() {
  const srcPath = path.resolve(__dirname, ".");
  readFiles(srcPath);

  const thisContainer: any = container;
  await Aigle.forEach(
    Array.from(thisContainer._registry._registryMap),
    ([Class, [option]]) => {
      if (option?.options?.lifecycle !== Lifecycle.Singleton) {
        return;
      }
      const instance = thisContainer.resolve(Class);
      if (typeof instance.init === "function") {
        return instance.init();
      }
    }
  );
}

const logger = new Logger(config.logLevel);
container.register(Logger, { useValue: logger });
const main = container.resolve(Main);

runAsync(async () => {
  await main.initAll();
  await initInstances();
  await main.listen();
});

process.on("SIGINT", async () => {
  const logger = container.resolve(Logger);
  logger.info("Closing server...");
  try {
    await main.close();
    process.exit(0);
  } catch (err) {
    logger.error("Closing server failed", err);
    process.exit(1);
  }
});
