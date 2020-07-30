import { PermissionResolvable, Message } from "discord.js";
import { BaseManager } from "../BaseManager";

export interface ICommandOption {
  aliases?: string[];
  description: string;
  category?: "info" | "music" | "dev";
  cd?: number;
  userPerms?: PermissionResolvable[];
  botPerms?: PermissionResolvable[];
  editable?: boolean;
  usage?: string | string[];
  example?: string[];
}

export class Command {
  public bot?: BaseManager;
  public name: string;
  public aliases: string[];
  public description: string;
  public category: "info" | "music" | "dev";
  public cd: number;
  public userPerms: PermissionResolvable[];
  public botPerms: PermissionResolvable[];
  public usage: string | string[];
  public example: string[];

  constructor(name: string, options: ICommandOption) {
    this.name = name;
    this.aliases = options.aliases || [];
    this.description = options.description;
    this.category = options.category || "dev";
    this.cd = options.cd || 0;
    this.userPerms = options.userPerms || [];
    this.botPerms = options.botPerms
      ? ["SEND_MESSAGES", ...options.botPerms]
      : ["SEND_MESSAGES"];
    this.usage = options.usage || "No usage provided";
    this.example = options.example || [];
  }

  public reload() {
    const path =
      __dirname + `/../../bot/commands/${this.category}/${this.name}.js`;
    delete require.cache[require.resolve(path)];

    const pull = require(path);
    this.bot!.commands.delete(this.name);
    this.bot!.commands.set(this.name, pull);
  }

  public unload() {
    const path =
      __dirname + `/../../bot/commands/${this.category}/${this.name}.js`;
    delete require.cache[require.resolve(path)];

    this.bot!.commands.delete(this.name);
  }
}
