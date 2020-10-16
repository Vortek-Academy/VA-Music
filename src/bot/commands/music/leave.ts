import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
	constructor() {
		super("leave", {
			aliases: ["stop", "exit"],
			description: "Leave voice channel",
			botPerms: ["CONNECT", "SPEAK"],
			userPerms: ["CONNECT"],
		});
	}

	async run(message: Message) {
		const { channel } = message.member!.voice;
		if (!channel) return message.em(`You need to be in a voice channel!`);

		const player = this.bot!.music!.playerCache.get(message.guild!.id);
		if (!player)
			return await message.em(`I am not playing music in this server!`);

		player.destroy();
		await message.em(`Ended the music session. Hope you had fun!`);
	}
}
