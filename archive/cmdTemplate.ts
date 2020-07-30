//@ts-ignore

import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor() {
    super("NAME", {
      aliases: [""],
      description: "",
      usage: "",
      botPerms: [],
      userPerms: [],
    });
  }

  async run(message: Message, args: string[]) {}
}
