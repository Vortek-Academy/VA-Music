import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor() {
    super("prefix", {
      description: "Change the bot prefix",
      usage: "<New Prefix>",
      userPerms: ["ADMINISTRATOR"],
    });
  }

  async run(message: Message, [pref, ...args]: string[]) {
    if (!pref) return await message.em(`Please enter a new prefix!`);
    if (pref.length > 3)
      return await message.em(`Prefix cannot be more than 3 letters!`);

    message.guild!.db!.prefix = pref;
    message.guild!.db!.save().catch(console.error);

    await message.em(`Prefix updated to \`${pref}\`!`);
  }
}
