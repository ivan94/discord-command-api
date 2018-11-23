import Command, { ArgSignature, ArgType } from "../src/Command";
import { should } from "chai";
import CommandPool from "../src/CommandPool";
import { InvalidTypeError, InvalidCallError } from "../src/Errors";

should();

class Mock {
    result1: string;
    result2: number;
    result3: boolean;
}

interface CommandArg {
    arg1: string;
    arg2: number;
    arg3: boolean;
};

class TestCommand extends Command<Mock> {
    constructor(keyword: string) { super(keyword) }

    signature():ArgSignature[] {
        return [
            {
                name: 'arg1',
                description: 'The first arg',
                type: ArgType.STRING
            },
            {
                name: 'arg2',
                description: 'The second arg',
                type: ArgType.NUMBER
            },
            {
                name: 'arg3',
                description: 'The third arg',
                type: ArgType.BOOLEAN
            }
        ]
    }

    execute({ arg1, arg2, arg3 }: CommandArg, bot: Mock): void {
        bot.result1 = arg1;
        bot.result2 = arg2;
        bot.result3 = arg3;
    }
    
    description: () => "Fake command for tests";
}

describe("Testing the command pool", () => {
    let bot = new Mock;
    let command = new TestCommand("test");
    let pool = new CommandPool<Mock>(["!"]);

    pool.register(command);

    it("should run with the correct arguments", () => {
        pool.runFromMessage("!test test 3 false", bot);

        bot.result1.should.be.equal("test");
        bot.result2.should.be.equal(3);
        bot.result3.should.be.false;
    });

    it("should not run with invalid number type", () => {
        let wrongCall = () => pool.runFromMessage("!test test eight true", bot);
        wrongCall.should.throw();
    });

    it("should not run with invalid boolean type", () => {
        let wrongCall = () => pool.runFromMessage("!test test 8 notbool", bot);
        wrongCall.should.throw();
    });

    it("should not run with fewer args", () => {
        let wrongCall = () => pool.runFromMessage("!test test 5", bot);
        wrongCall.should.throw();
    });

    it("should not run with too many args", () => {
        let wrongCall = () => pool.runFromMessage("!test test 2 true another", bot);
        wrongCall.should.throw();
    });

    it("should register two multiple commands with different keywords", () => {
        let anotherCommand = new TestCommand('test2');
        pool.register(anotherCommand);
        Object.keys(pool.commands).length.should.be.equal(2);
    });

    it("should not register two commands with the same keyword", () => {
        let anotherCommand = new TestCommand('test');
        let wrongCall = () => pool.register(anotherCommand);
        wrongCall.should.throw();
    });
});