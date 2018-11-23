export enum ArgType {NUMBER, STRING, BOOLEAN};
export interface ArgSignature{
    name: string;
    description: string;
    type: ArgType;
}

export default abstract class Command<BotRef> {
    readonly keyword: string;
    
    constructor(keyword: string) {
        this.keyword = keyword;
    }

    abstract signature(): ArgSignature[];
    abstract execute(args: object, ref: BotRef): void;
    description(): string {
        return "";
    }
}