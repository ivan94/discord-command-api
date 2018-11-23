import ICommand from "./ICommand";
export interface CommandPoolEntries<BotRef> {
    [keyword: string]: ICommand<BotRef>;
}
export default class CommandPool<BotRef> {
    readonly commands: CommandPoolEntries<BotRef>;
    private markers;
    constructor(markers: string[]);
    register(command: ICommand<BotRef>): void;
    runFromMessage(message: string, ref: BotRef): void;
    run(command: ICommand<BotRef>, words: string[], ref: BotRef): void;
    private buildArgs;
    private convertArg;
    private removeMarker;
}
