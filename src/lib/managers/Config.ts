require("dotenv").config({
  path: __dirname + "/../../../.env",
});
import config from "../../config.json";
import { NodeOptions } from "@anonymousg/lavajs";

export interface IConfigOptions {
  token: string;
  mongo: string;
  prefix: string;
  node: NodeOptions[];
}

export class Config {
  public config: IConfigOptions;
  public type: "dev" | "prod";

  constructor() {
    this.type = process.env.TYPE as "dev" | "prod";
    this.config = config[this.type];
  }

  get(locale: "token" | "mongo" | "prefix" | "node" = "token") {
    return this.config[locale];
  }
}
