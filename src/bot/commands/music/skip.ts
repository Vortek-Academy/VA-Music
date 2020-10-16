import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
	constructor() {
		super("skip", {
			aliases: ["next"],
			description: "Play the next song in the queue",
			botPerms: ["CONNECT", "SPEAK"],
			userPerms: ["CONNECT"],
		});
	}

	async run(message: Message) {
		const { channel } = message.member!.voice;
		if (!channel) return message.em(`You need to be in a voice channel!`);

		const player = this.bot!.music!.playerCache.get(message.guild!.id);
		const queue = this.bot!.musicQueue.get(message.guild!.id);

		if (!player)
			return await message.em("I am not playing music in this server!");
		if (queue!.tracks.length === 1)
			return await message.em(`No more tracks in the queue!`);
		if (player.state.track!.user !== message.author.id)
			return await message.em(
				`Sorry the track was added by ${message.member!} so only he can skip!`
			);

		player.play(queue!.tracks[1], {});
	}
}
