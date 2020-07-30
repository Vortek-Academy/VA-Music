import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor() {
    super("help", {
      aliases: ["h"],
      description: "Get bot command help",
      usage: "[Command Name]",
    });
  }

  async run(message: Message, [cmd, ...args]: string[]) {
    if (cmd) return this.getCmd(message, cmd);

    const categories = this.bot!.commands.reduce(
      (acc: any[], val: any) =>
        acc.includes(val.category) ? acc : [...acc, val.category],
      []
    );

    const help = message.embed
      .setTitle("VA-Music Help")
      .setDescription(
        `My prefix for **${message.guild!.name}** is \`${
          message.guild!.db!.prefix
        }\``
      )
      .setTimestamp()
      .setFooter(`Use ${message.guild!.db!.prefix}help [Command Name]`);

    for (let cat of categories)
      help.addField(
        cat[0].toUpperCase() + cat.slice(1),
        this.bot!.commands.filter((c) => c.category === cat)
          .map((x) => `\`${x.name}\``)
          .join(" | ")
      );

    message.channel.send(help).catch();
  }

  getCmd(message: Message, cmd: string) {
    const command = this.bot!.handler.getCmd(cmd);
    if (!command)
      return message.em(`No command found with the name or alias: \`${cmd}\``);

    const help = message.embed
      .setTitle(
        `Command Name: ${command.name[0].toUpperCase() + command.name.slice(1)}`
      )
      .setDescription(command.description)
      .addField(
        "Aliases",
        command.aliases.length
          ? command.aliases.map((a) => `\`${a}\``).join(" | ")
          : "`None`"
      )
      .addField(
        "Permissions Needed",
        [
          `Bot Perms: ${
            command.botPerms.length
              ? command.botPerms.map((x) => `\`${x}\``).join(" | ")
              : "`NONE`"
          }`,
          `User Perms: ${
            command.userPerms.length
              ? command.userPerms.map((x) => `\`${x}\``).join(" | ")
              : "`NONE`"
          }`,
        ].join("\n")
      )
      .addField("Command Usage", command.usage)
      .setTimestamp()
      .setFooter(message.author.tag);

    message.channel.send(help).catch();
  }
}
