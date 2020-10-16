import { BotEvent, Bot } from "../../lib";
import { Message } from "discord.js";

export default class EMessage extends BotEvent {
	constructor() {
		super("message");
	}

	public async run(bot: Bot, message: Message) {
		if (message.author.bot) return;
		if (!message.guild) return;
		if (!message.member) await message.guild.members.fetch(message.author);

		const prefix = bot.config.get("prefix") as string;

		// A safety check
		if (!message.guild.me!.hasPermission("SEND_MESSAGES")) return;

		// Declaring arguments, checking if the message starts with the prefix
		if (!message.content.startsWith(prefix)) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const key = args.shift()!.toLowerCase();

		// Trying to get the command
		const command = bot.handler.getCmd(key);
		if (!command) return;

		if (
			command.userPerms.every((p) =>
				message.member!.hasPermission(p, {
					checkAdmin: true,
					checkOwner: true,
				})
			) &&
			command.botPerms.every((p) =>
				message.guild!.me!.hasPermission(p, { checkAdmin: true })
			)
		) {
			await (command as any).run(message, args);
		} else {
			let perms = message.embed
				.setTitle(`Not Enough Permissions`)
				.setColor("#d94337")
				.addField(
					"User Perms",
					`Users need the following permission(s) to run this command: ${
						command.userPerms.length
							? command.userPerms.map((x) => `\`${x}\``).join(" | ")
							: `\`NONE\``
					}`
				)
				.addField(
					"Bot Perms",
					`I need the following permission(s) to run this command: ${
						command.botPerms.length
							? command.botPerms.map((x) => `\`${x}\``).join(" | ")
							: `\`NONE\``
					}`
				);
			message.channel.send(perms).catch();
		}
	}
}
