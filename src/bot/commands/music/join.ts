import { Command } from "../../../lib";
import { Message, TextChannel } from "discord.js";

export default class extends Command {
	constructor() {
		super("join", {
			description: "Start a music session",
			botPerms: ["CONNECT", "SPEAK"],
			userPerms: ["CONNECT"],
		});
	}

	async run(message: Message) {
		const { channel } = message.member!.voice;
		if (!channel) return message.em(`You need to be in a voice channel!`);
		if (this.bot!.music!.playerCache.has(message.guild!.id))
			return await message.em(`I am already in a music channel!`);

		this.bot!.music!.spawnPlayer({
			guild: message.guild!.id,
			textChannel: message.channel.id,
			voiceChannel: channel.id,
			deafen: true,
			mute: false,
			volume: 100,
		});

		await message.em(`Joined ${channel.name} and bound to ${message.channel}!`);
	}
}
