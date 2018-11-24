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

    signature(): ArgSignature[] {
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

class DidRunCommand extends Command<{ didRun: boolean }> {
    constructor() { super('didrun') }
    signature(): ArgSignature[] { return [] };
    execute({ }, obj: { didRun: boolean }) {
        obj.didRun = true;
    }
}

let bot = new Mock;
let command = new TestCommand("test");
let pool = new CommandPool<Mock>(["!"]);


let reset = () => {
    bot = new Mock;
    command = new TestCommand("test");
    pool = new CommandPool<Mock>(["!"]);
    pool.register(command);
}


describe("Command Pool", () => {
    describe("#register", () => {
        it("should register a command", () => {
            let pool = new CommandPool(["!"]);
            pool.register(new TestCommand("test"))

            Object.keys(pool.commands).length.should.be.equal(1);
        });

        it("should register multiple commands", () => {
            let pool = new CommandPool(["!"]);
            pool.register(new TestCommand("test"))
            pool.register(new TestCommand("test2"))

            Object.keys(pool.commands).length.should.be.equal(2);
        });

        it("should not register two commands with the same keyword", () => {
            let pool = new CommandPool(["!"]);
            pool.register(new TestCommand("test"))
            let wrongCall = () => pool.register(new TestCommand("test"))
            wrongCall.should.throw();
        });
    });

    describe("#runFromMessage", () => {
        it("should not run regular messages", () => {
            let pool = new CommandPool(["!"]);
            pool.register(new DidRunCommand);

            let o = { didRun: false };
            pool.runFromMessage('Regular another common message', o);

            o.didRun.should.be.false;
        });

        it("should run non arguments command", () => {
            let pool = new CommandPool(["!"]);
            pool.register(new DidRunCommand);

            let o = { didRun: false };
            pool.runFromMessage('!didrun', o);

            o.didRun.should.be.true;
        })

        it("should not run when marker list is empty", () => {
            let pool = new CommandPool([]);
            pool.register(new DidRunCommand);

            let o = { didRun: false };
            pool.runFromMessage('!didrun', o);

            o.didRun.should.be.false;
        });

        it("should not run when marker list contains only one empty string", () => {
            let pool = new CommandPool([""]);
            pool.register(new DidRunCommand);

            let o = { didRun: false };
            pool.runFromMessage('!didrun', o);

            o.didRun.should.be.false;
        });

        it("should run with the correct arguments", () => {
            reset();
            pool.runFromMessage("!test test 3 false", bot);

            bot.result1.should.be.equal("test");
            bot.result2.should.be.equal(3);
            bot.result3.should.be.false;
        });

        it("should throw error with invalid number type", () => {
            reset();
            let wrongCall = () => pool.runFromMessage("!test test eight true", bot);
            wrongCall.should.throw();
        });

        it("should throw error with invalid boolean type", () => {
            reset();
            let wrongCall = () => pool.runFromMessage("!test test 8 notbool", bot);
            wrongCall.should.throw();
        });

        it("should throw error with fewer args", () => {
            reset();
            let wrongCall = () => pool.runFromMessage("!test test 5", bot);
            wrongCall.should.throw();
        });

        it("should throw error with too many args", () => {
            reset();
            let wrongCall = () => pool.runFromMessage("!test test 2 true another", bot);
            wrongCall.should.throw();
        });
    });
});