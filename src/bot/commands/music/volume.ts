import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor() {
    super("volume", {
      aliases: ["vol"],
      description: "Set the player volume or reset to 100",
      usage: "[New Volume]",
      botPerms: ["CONNECT", "SPEAK"],
      userPerms: ["CONNECT"],
    });
  }

  async run(message: Message, [vol, ...args]: string[]) {
    const { channel } = message.member!.voice;
    if (!channel) return message.em(`You need to be in a voice channel!`);

    const player = this.bot!.music!.playerCollection.get(message.guild!.id);
    if (!player)
      return await message.em(`I am not playing music in this server!`);

    if (isNaN(parseInt(vol)))
      return await message.em(`My current volume is \`${player.volume}\`!`);
    if (parseInt(vol) > 200 || parseInt(vol) < 10)
      return await message.em(
        `Volume cannot be more than 200 and less than 10!`
      );

    player.setVolume(parseInt(vol));
    await message.em(`Player volume set to \`${player.volume}\`!`);
  }
}
