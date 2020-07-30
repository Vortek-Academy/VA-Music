import { Command } from "../../../lib";
import { Message } from "discord.js";
import { Utils } from "@anonymousg/lavajs";

export default class extends Command {
  constructor() {
    super("queue", {
      aliases: ["q"],
      description: "See your current songs queue",
    });
  }

  async run(message: Message) {
    const player = this.bot!.music!.playerCollection.get(message.guild!.id);
    if (!player)
      return await message.em("I am not playing music in this server!");

    const queue = message.embed
      .setTitle("Music Queue")
      .setDescription(
        [
          `Total number of tracks: ${player.queue.size}`,
          `Total duration: ${Utils.formatTime(player.queue.duration)}`,
        ].join("\n")
      );
    let data = "";

    for (const [k, v] of player.queue.KVArray()) {
      const { title, length, uri } = v;
      data += `[${k}] [${title}](${uri}) - ${Utils.formatTime(length)}\n`;
    }

    await message.channel.send(queue.addField("Track List", data.trim()));
  }
}
