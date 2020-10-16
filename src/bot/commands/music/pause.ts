import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
	constructor() {
		super("pause", {
			aliases: ["p"],
			description: "Toggle pausing of the song",
			botPerms: ["CONNECT", "SPEAK"],
			userPerms: ["CONNECT"],
		});
	}

	async run(message: Message) {
		const { channel } = message.member!.voice;
		if (!channel) return message.em(`You need to be in a voice channel!`);

		const player = this.bot!.music!.playerCache.get(message.guild!.id);
		if (!player)
			return await message.em("I am not playing music in this server!");
		if (!player.trackLoaded)
			return await message.em("No songs are being played right now!");

		player.pause();
		await message.em(
			`${player.state.paused ? "Paused" : "Resumed"} the playback!`
		);
	}
}
