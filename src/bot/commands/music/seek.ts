import { Command } from "../../../lib/";
import { Message } from "discord.js";
import { Utils } from "@anonymousg/lavajs";
import ms from "ms";

export default class extends Command {
  constructor() {
    super("seek", {
      aliases: ["goto"],
      description: "Seek the track",
      usage: "<Timestamp>",
      botPerms: ["CONNECT", "SPEAK"],
      userPerms: ["CONNECT"],
    });
  }

  async run(message: Message, args: string[]) {
    const { channel } = message.member!.voice;
    if (!channel) return message.em(`You need to be in a voice channel!`);

    const player = this.bot!.music!.playerCollection.get(message.guild!.id);
    if (!player)
      return await message.em("I am not playing music in this server!");
    if (!player.playing)
      return await message.em("No songs are being played right now!");

    let time = args.reduce((acc, val) => acc + (ms(val) || 0), 0);
    if (isNaN(time) || time > player.queue.first.length)
      return message.em(
        `Please enter a proper time in the \`0h 0m 0s\` format and make sure it is less than the song duration!`
      );

    player.seek(time);
    await message.em(`Seeked to \`${args.join(" ")}\`!`);
  }
}
