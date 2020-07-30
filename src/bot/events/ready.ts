import { BotEvent, Bot } from "../../lib";

export default class Ready extends BotEvent {
  constructor() {
    super("ready");
  }

  public async run(bot: Bot) {
    let guilds = await bot.shard!.fetchClientValues("guilds.cache.size");
    guilds = guilds.reduce((acc, val) => acc + val, 0);
    await bot.user!.setPresence({
      status: "online",
      activity: {
        name: `${guilds} guild(s)`,
        type: "WATCHING",
      },
    });
    bot.musicClient();
  }
}
