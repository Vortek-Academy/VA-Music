import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor() {
    super("ping", {
      aliases: ["wsping"],
      description: "Get the bot's API latency",
    });
  }

  async run(message: Message) {
    await message.em(`My current ping is \`${this.bot!.ws.ping}ms\`!`);
  }
}
