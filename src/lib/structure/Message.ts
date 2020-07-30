import { Structures, MessageEmbed } from "discord.js";

export default () => {
  Structures.extend(
    "Message",
    (Message) =>
      class extends Message {
        public em(content: string) {
          return this.channel.send(new MessageEmbed().setDescription(content));
        }

        get embed() {
          return new MessageEmbed();
        }
      }
  );
};
