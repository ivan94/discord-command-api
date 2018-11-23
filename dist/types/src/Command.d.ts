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
export default abstract class Command<BotRef> {
    readonly keyword: string;
    constructor(keyword: string);
    abstract signature(): ArgSignature[];
    abstract execute(args: object, ref: BotRef): void;
    description(): string;
}
