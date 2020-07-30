import { Structures } from "discord.js";

export default () => {
  Structures.extend(
    "User",
    (User) =>
      class extends User {
        public constructor() {
          super(arguments[0], arguments[1]);
        }
      }
  );
};
