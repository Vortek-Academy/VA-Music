import { Command } from "../../../lib";
import { Message, TextChannel } from "discord.js";

export default class extends Command {
	constructor() {
		super("play", {
			description: "Play a music track",
			usage: ["<Song Name>", "<Song Link>"].join("\n"),
			botPerms: ["CONNECT", "SPEAK"],
			userPerms: ["CONNECT"],
		});
	}

	async run(message: Message, args: string[]) {
		const { channel } = message.member!.voice;
		if (!channel) return message.em(`You need to be in a voice channel!`);

		const player = this.bot!.music!.spawnPlayer({
			guild: message.guild!.id,
			textChannel: message.channel.id,
			voiceChannel: channel.id,
			deafen: true,
			mute: false,
			volume: 100,
		});
		const queue = this.bot!.musicQueue.get(message.guild!.id);

		if (!args[0]) return await message.em(`Please enter a song name or link!`);
		const trackQuery = args.join(" ");

		try {
			const track = await this.bot!.music!.search(trackQuery, {
				source: "yt",
				user: message.author.id,
			});
			if (track.length === 0)
				return await message.em(
					`No songs found for the following query: \`${trackQuery}\`!`
				);

			if (track!.every((x) => x.playlist)) {
				queue!.tracks.push(...track);
				await message.em(
					[
						`Playlist added to queue!`,
						`- Name: ${track[0].playlist}`,
						`- Tracks: ${track.length}`,
						`- Duration: ${track.reduce(
							(acc, val) => acc + val.info.length,
							0
						)}`,
					].join("\n")
				);
			} else if (track) {
				queue!.tracks.push(track[0]);
				await message.em(
					[
						`Track added to queue!`,
						`- Name: [${track[0].info.title}](${track[0].info.uri})`,
						`- Duration: ${track[0].info.length}`,
					].join("\n")
				);
			}
		} catch (e) {
			if (e)
				return await message.em(
					`No songs found for the following query: \`${trackQuery}\`!`
				);
		}

		if (!player.trackLoaded) player.play(queue!.tracks[0], {});
	}
}
