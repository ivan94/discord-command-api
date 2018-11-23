export declare enum ArgType {
    NUMBER = 0,
    STRING = 1,
    BOOLEAN = 2
}
export interface ArgSignature {
    name: string;
    description: string;
    type: ArgType;
}
export default interface ICommand<BotRef> {
    readonly keyword: string;
    signature(): ArgSignature[];
    execute(args: object, ref: BotRef): void;
    description(): string;
}
