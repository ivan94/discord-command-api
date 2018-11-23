import ICommand, { ArgType } from "./ICommand";
import { KeywordBoundError, InvalidCallError, InvalidTypeError } from "./Errors";

export interface CommandPoolEntries<BotRef> {
    [keyword: string]: ICommand<BotRef>;
}

export default class CommandPool<BotRef> {
    readonly commands: CommandPoolEntries<BotRef> = {};
    private markers: string[];

    constructor(markers: string[]) {
        this.markers = markers;
    }

    public register(command: ICommand<BotRef>): void {
        if(this.commands[command.keyword]) {
            throw new KeywordBoundError;
        }

        this.commands[command.keyword] = command;
    }

    public runFromMessage(message: string, ref: BotRef): void {
        if(!message) {
            return;
        }

        let cleanMessage = this.removeMarker(message);
        if(cleanMessage) {
            let words = cleanMessage.split(/\s/);
            let keyword = words[0];

            this.run(this.commands[keyword], words, ref);
        }
    }

    public run(command: ICommand<BotRef>, words: string[], ref: BotRef): void {
        command.execute(this.buildArgs(command, words), ref);
    }

    private buildArgs(command: ICommand<BotRef>, words: string[]): object {
        try {
            let signature = command.signature();
            let args = {};
            if(signature.length != (words.length - 1)){
                throw new InvalidCallError("Arguments don't match the signature");
            }
            signature.forEach((arg, i) => {
                args[arg.name] = this.convertArg(words[i + 1], arg.type);
            });

            return args;   
        } catch (error) {
            throw new InvalidCallError(error);
        }
    }

    private convertArg(value: string, type: ArgType): boolean | string | number {
        switch(type) {
            case ArgType.BOOLEAN:
                if(value != 'true' && value != 'false') {
                    throw new InvalidCallError(`${value} should be boolean`)
                }
                return value == 'true';
            case ArgType.STRING:
                return value;
            case ArgType.NUMBER:
                let result = Number(value);
                if(isNaN(result)) {
                    throw new InvalidCallError(`${value} should be a number`);
                }
                return result;
            default:
                throw new InvalidTypeError;
        }
    }

    private removeMarker(message: string): string {
        return this.markers.reduce((acc, marker) => message.startsWith(marker)? message.substring(marker.length): acc, null);
    }

}