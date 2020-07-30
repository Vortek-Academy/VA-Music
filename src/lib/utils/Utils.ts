import chalk from "chalk";
import { BaseManager } from "../BaseManager";

export class Utils {
  public bot?: BaseManager;

  constructor(bot?: BaseManager) {
    this.bot = bot;
  }

  public log(content: string, type: "info" | "error" = "info"): void {
    const tag = chalk.bold.gray(`[${this.textFormat(type, "upper")}]`);
    const text = chalk[type === "error" ? "red" : "yellow"](content);
    const time = chalk.cyan(`[${this.toDate(Date.now())}]`);

    const streamType = type === "error" ? process.stderr : process.stdout;
    streamType.write(`${time} ${tag} ${text}\n`);
  }

  public textFormat(text: string, type: "upper"): string {
    if (type === "upper") {
      return text[0].toUpperCase() + text.slice(1);
    }

    return text;
  }

  public toDate(ms: number): string {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const [date, time] = formatter.format(ms).split(",");
    return `${date.trim()} ${time.trim()}`;
  }
}
