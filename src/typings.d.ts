import { GuildEntity } from "./lib/models/GuildModel";

declare module "discord.js" {
  interface Message {
    em(content: string): Promise<Message>;

    embed: MessageEmbed;
  }

  interface Guild {
    db?: GuildEntity;

    _init(): void;
  }

  interface User {}

  interface GuildMember {}
}
