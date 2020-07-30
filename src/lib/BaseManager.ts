import { Client, Collection, MessageEmbed } from "discord.js";
import { Handler } from "./managers/Handler";
import { Utils } from "./utils/Utils";
import { createConnection } from "typeorm";
import { Command } from "./structure/command";
import { GuildEntity } from "./models/GuildModel";
import { LavaClient, NodeOptions, Utils as utils } from "@anonymousg/lavajs";
import { Config } from "./managers/Config";

export class BaseManager extends Client {
  private TOKEN: string;

  public commands: Collection<string, Command> = new Collection();
  public handler: Handler = new Handler(this);
  public music?: LavaClient;

  public utils = new Utils(this);
  public config: Config = new Config();

  public constructor() {
    super();
    this.TOKEN = this.config.get("token") as string;
  }

  public start(paths: { events: string; commands: string }) {
    this.handler.loadAll({ cmd: paths.commands, evt: paths.events });
    super
      .login(this.TOKEN)
      .then(() =>
        this.utils.log(
          `[Discord Client] => Connected as ${this.user!.username}!`
        )
      )
      .catch((e) => {
        if (e) this.utils.log(e.message, "error");
      });
  }

  public loadMongo() {
    createConnection({
      type: "mongodb",
      url: this.config.get("mongo") as string,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      entities: [GuildEntity],
      synchronize: true,
    })
      .then(() => this.utils.log("[MongoDB] => Connected!"))
      .catch((e) => {
        if (e) this.utils.log(e.message, "error");
      });
  }

  public musicClient() {
    this.music = new LavaClient(this, this.config.get("node") as NodeOptions[]);

    this.music.on("nodeSuccess", () =>
      this.utils.log("[LavaJS] => Node connected!")
    );
    this.music.on("nodeError", (node, err) => this.utils.log(err, "error"));

    this.music.on("trackPlay", (track, player) => {
      const { title, length, uri, thumbnail, user } = track;
      player.options.textChannel
        .send(
          new MessageEmbed()
            .setAuthor("New Track Playing")
            .setTitle(`${title}`)
            .setDescription(
              `Requested by ${user}. Track length: ${utils.formatTime(length)}`
            )
            .setURL(uri)
            .setImage(thumbnail.medium)
            .setColor("RANDOM")
        )
        .catch();
    });

    this.music.on("queueOver", (player) => {
      player.options.textChannel
        .send(
          new MessageEmbed().setDescription(
            `Your current queue has ended. Leaving voice channel!`
          )
        )
        .catch();
      player.destroy();
    });
  }
}
