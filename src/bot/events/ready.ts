import { BotEvent, Bot } from "../../lib";

export default class Ready extends BotEvent {
	constructor() {
		super("ready");
	}

	public async run(bot: Bot) {
		await bot.user!.setPresence({
			status: "online",
			activity: {
				name: `${bot.guilds.cache.size} guild(s)`,
				type: "WATCHING",
			},
		});
		bot.musicClient();
	}
}
