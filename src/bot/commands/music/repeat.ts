import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
	constructor() {
		super("repeat", {
			aliases: ["re"],
			description: "Set repeat for track or queue or disable both",
			usage: "[track | queue]",
			botPerms: ["CONNECT", "SPEAK"],
			userPerms: ["CONNECT"],
		});
	}

	async run(message: Message, [mode, ...args]: string[]) {
		const { channel } = message.member!.voice;
		if (!channel) return message.em(`You need to be in a voice channel!`);

		const player = this.bot!.music!.playerCache.get(message.guild!.id);
		if (!player)
			return await message.em("I am not playing music in this server!");
		const queue = this.bot!.musicQueue.get(message.guild!.id);

		mode && ["track", "queue"].includes(mode.toLowerCase())
			? (queue!.repeat = mode as "track" | "queue")
			: delete queue!.repeat;

		await message.em(
			`Player repeat set to ${
				queue!.repeat ? `${queue!.repeat}` : "`disabled`"
			}!`
		);
	}
}
