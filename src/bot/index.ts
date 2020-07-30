import { ShardingManager } from "discord.js";
import { Config } from "../lib";
import { Utils } from "../lib/utils/Utils";

const config = new Config();
const utils = new Utils();
const manager = new ShardingManager(__dirname + "/bot.js", {
  token: config.get("token") as string,
});
(async () => await manager.spawn())();

manager.on("shardCreate", (shard) =>
  utils.log(`[Shard] => Spawned ${shard.id}!`)
);
