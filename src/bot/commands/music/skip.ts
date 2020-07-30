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

    const player = await this.bot!.music!.playerCollection.get(
      message.guild!.id
    );
    if (!player)
      return await message.em("I am not playing music in this server!");
    if (player.queue.size === 1)
      return await message.em(`No more tracks in the queue!`);
    if (player.queue.first.user !== message.member!)
      return await message.em(
        `Sorry the track was added by ${player.queue.first.user} so only he can skip!`
      );

    await player.play();
  }
}
