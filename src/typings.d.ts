declare module "discord.js" {
	interface Message {
		em(content: string): Promise<Message>;

		embed: MessageEmbed;
	}
}
