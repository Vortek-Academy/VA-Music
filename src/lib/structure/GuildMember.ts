import { Structures } from "discord.js";

export default () => {
  Structures.extend(
    "GuildMember",
    (GuildMember) =>
      class extends GuildMember {
        public constructor() {
          super(arguments[0], arguments[1], arguments[2]);
        }
      }
  );
};
