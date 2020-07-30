import {
  Entity,
  BaseEntity,
  ObjectIdColumn,
  PrimaryColumn,
  ObjectID,
  Column,
} from "typeorm";
import { Snowflake } from "discord.js";

@Entity("guilds")
export class GuildEntity extends BaseEntity {
  @ObjectIdColumn() public _id?: ObjectID;
  @PrimaryColumn() public id: Snowflake;
  @Column() public prefix: string = "!";

  constructor(id: Snowflake) {
    super();
    this.id = id;
  }
}
