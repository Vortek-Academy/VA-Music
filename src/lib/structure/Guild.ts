import { Structures } from "discord.js";
import { GuildEntity } from "../models/GuildModel";

export default () => {
  Structures.extend(
    "Guild",
    (Guild) =>
      class extends Guild {
        public db?: GuildEntity;

        public constructor() {
          super(arguments[0], arguments[1]);
          (async () => await this._init())();
        }

        public async _init() {
          this.db =
            (await GuildEntity.findOne({ id: this.id })) ||
            new GuildEntity(this.id);
        }
      }
  );
};
