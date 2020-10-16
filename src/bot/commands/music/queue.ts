import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
	constructor() {
		super("queue", {
			aliases: ["q"],
			description: "See your current songs queue",
		});
	}

	async run(message: Message) {
		const player = this.bot!.music!.playerCache.get(message.guild!.id);
		if (!player)
			return await message.em("I am not playing music in this server!");
		const queue = this.bot!.musicQueue.get(message.guild!.id);

		const queueEmbed = message.embed
			.setTitle("Music Queue")
			.setDescription(
				[
					`Total number of tracks: ${queue!.tracks.length}`,
					`Total duration: ${queue!.tracks.reduce(
						(acc, val) => acc + val.info.length,
						0
					)}`,
				].join("\n")
			);
		let data = "";

		for (let i = 0; i < queue!.tracks.length; i++) {
			const { title, length, uri } = queue!.tracks[i].info;
			data += `[${i + 1}] [${title}](${uri}) - ${length}\n`;
		}

		await message.channel.send(queueEmbed.addField("Track List", data.trim()));
	}
}
