import { BaseManager } from "../BaseManager";

require("../structure/Message").default();
require("../structure/Guild").default();
require("../structure/GuildMember").default();
require("../structure/User").default();

export class Bot extends BaseManager {
  constructor() {
    super();
  }

  public botStart() {
    this.loadMongo();
    this.start({
      events: __dirname + "/../../bot/events",
      commands: __dirname + "/../../bot/commands",
    });
  }
}
