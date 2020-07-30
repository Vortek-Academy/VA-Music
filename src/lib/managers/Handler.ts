import { BaseManager } from "../BaseManager";
import { readdirSync } from "fs";

export class Handler {
  public readonly manager: BaseManager;

  constructor(base: BaseManager) {
    this.manager = base;
  }

  public loadCommand(dir: string) {
    const cats = readdirSync(dir).filter((d: string) => !d.endsWith(".js"));
    cats.forEach((category: string) => {
      readdirSync(`${dir}/${category}/`)
        .filter((f: string) => f.endsWith(".js"))
        .forEach((cmd: string) => {
          try {
            let { default: command } = require(`${dir}/${category}/${cmd}`);
            command = new command();
            command.bot = this.manager;
            command.category = category;
            this.manager.commands.set(command.name, command);
          } catch (e) {
            this.manager.utils.log(`[${cmd}] => ${e.message}`, "error");
          }
        });
    });
    this.manager.utils.log("[Command Handler] => Loaded all commands!");
  }

  public loadEvent(dir: string) {
    readdirSync(dir)
      .filter((f: string) => f.endsWith(".js"))
      .forEach((evt: any) => {
        try {
          let { default: event } = require(`${dir}/${evt}`);
          event = new event();
          this.manager.on(event.name, event.run.bind(null, this.manager));
        } catch (e) {
          this.manager.utils.log(`[${evt.name}] => ${e.message}`, "error");
        }
      });
    this.manager.utils.log("[Event Handler] => Loaded all events!");
  }

  public loadAll(path: { cmd: string; evt: string }) {
    this.loadCommand(path.cmd);
    this.loadEvent(path.evt);
  }

  public getCmd(name: string) {
    return (
      this.manager.commands.find(
        (cmd) =>
          cmd.name.toLowerCase() === name.toLowerCase() ||
          cmd.aliases.map((a) => a.toLowerCase()).includes(name.toLowerCase())
      ) || null
    );
  }
}
