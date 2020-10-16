import { Client, Collection, MessageEmbed } from "discord.js";
import { Handler } from "./managers/Handler";
import { Utils } from "./utils/Utils";
import { Command } from "./structure/command";
import {
	Cache,
	IDiscordPacket,
	INodeOptions,
	LinkClient,
	Track,
} from "playlink";
import { Config } from "./managers/Config";
import { TextChannel } from "discord.js";

export class BaseManager extends Client {
	private TOKEN: string;

	public commands: Collection<string, Command> = new Collection();
	public handler: Handler = new Handler(this);

	public music?: LinkClient;
	public musicQueue: Cache<
		string,
		{ repeat?: "queue" | "track"; tracks: Track[] }
	> = new Cache();

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

	public musicClient() {
		this.music = new LinkClient(this.config.get("node") as INodeOptions[], {
			id: this.user!.id,
			shards: 1,
			wsSend: (packet: IDiscordPacket) => this.ws.shards.get(0)!.send(packet),
		});

		this.music.on("conOpen", () =>
			this.utils.log("[Music] => Node connected!")
		);
		this.music.on("conError", (node, err) =>
			this.utils.log(err.message, "error")
		);

		this.music.on("playerSpawn", (player) =>
			this.musicQueue.set(player.config.guild, { tracks: [] })
		);

		this.music.on("trackStart", (track, player) => {
			const { title, length, uri } = track.info;
			const guild = this.guilds.cache.get(player.config.guild);
			const channel = guild?.channels.cache.get(
				player.config.textChannel
			) as TextChannel;

			channel
				?.send(
					new MessageEmbed()
						.setAuthor("New Track Playing")
						.setTitle(`${title}`)
						.setDescription(
							`Requested by ${guild!.members.cache.get(
								track.user
							)}. Track length: ${length}`
						)
						.setImage(track.thumbnail("maxresdefault") || "")
						.setURL(uri)
						.setColor("RANDOM")
				)
				.catch();
		});

		this.music.on("trackEnd", (track, player, type) => {
			const guild = this.guilds.cache.get(player.config.guild);
			const channel = guild?.channels.cache.get(
				player.config.textChannel
			) as TextChannel;

			const queue = this.musicQueue.get(player.config.guild);

			if (queue && queue.tracks[0] === track && queue.repeat !== "track") {
				if (queue.repeat === "queue") queue.tracks.push(queue.tracks.shift()!);
				else queue.tracks.shift();
			}

			if (!queue || queue.tracks.length === 0) {
				channel
					?.send(
						new MessageEmbed().setDescription(
							`Your current queue has ended. Leaving voice channel!`
						)
					)
					.catch();
				player.destroy();
			} else if (type !== "REPLACED") player.play(queue.tracks[0], {});
		});
	}
}
