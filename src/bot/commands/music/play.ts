import { Command } from "../../../lib";
import { Message, TextChannel } from "discord.js";
import { Utils } from "@anonymousg/lavajs";

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

    const player = this.bot!.music!.spawnPlayer(
      {
        guild: message.guild!,
        textChannel: message.channel as TextChannel,
        voiceChannel: channel,
      },
      {
        repeatQueue: false,
        repeatTrack: false,
        skipOnError: true,
      }
    );

    if (!args[0]) return await message.em(`Please enter a song name or link!`);
    const trackQuery = args.join(" ");
    let track;

    try {
      track = await player.lavaSearch(trackQuery, message.member!, {
        source: "yt",
        add: false,
      });
    } catch (e) {
      if (e)
        return await message.em(
          `No songs found for the following query: \`${trackQuery}\`!`
        );
    }

    if (Array.isArray(track)) {
      player.queue.add(track[0]);
      await message.em(
        [
          `Track added to queue!`,
          `- Name: [${track[0].title}](${track[0].uri})`,
          `- Duration: ${Utils.formatTime(track[0].length)}`,
        ].join("\n")
      );
    } else if (track) {
      player.queue.add(track.tracks);
      await message.em(
        [
          `Playlist added to queue!`,
          `- Name: ${track.name}`,
          `- Tracks: ${track.trackCount}`,
          `- Duration: ${Utils.formatTime(track.duration)}`,
        ].join("\n")
      );
    }

    if (!player.playing) player.play();
  }
}
