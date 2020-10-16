require("dotenv").config({
	path: __dirname + "/../../../.env",
});
import config from "../../config.json";
import { INodeOptions } from "playlink";

export interface IConfigOptions {
	token: string;
	prefix: string;
	node: INodeOptions[];
}

export class Config {
	public config: IConfigOptions;
	public type: "dev" | "prod";

	constructor() {
		this.type = process.env.TYPE as "dev" | "prod";
		this.config = config[this.type];
	}

	get(locale: "token" | "prefix" | "node" = "token") {
		return this.config[locale];
	}
}
