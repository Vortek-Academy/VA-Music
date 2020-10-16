import { stat } from "fs";
import { IServerUpdate, IStateUpdate } from "playlink";
import { BaseManager } from "../BaseManager";

require("../structure/Message").default();

export class Bot extends BaseManager {
	constructor() {
		super();
	}

	public botStart() {
		this.start({
			events: __dirname + "/../../bot/events",
			commands: __dirname + "/../../bot/commands",
		});

		this.on("raw", (state) => {
			if (
				!["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(state.t) ||
				!state.d.guild_id
			)
				return;

			if ("session_id" in state.d) {
				this.music!.updateVoiceState({
					guild_id: state.d.guild_id,
					channel_id: state.d.channel_id,
					session_id: state.d.session_id,
				});
			} else {
				this.music!.updateVoiceState({
					token: state.d.token,
					guild_id: state.d.guild_id,
					endpoint: state.d.endpoint,
				});
			}
		});
	}
}
