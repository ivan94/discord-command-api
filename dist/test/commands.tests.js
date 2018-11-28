"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Command_1 = require("../src/Command");
var chai_1 = require("chai");
var CommandPool_1 = require("../src/CommandPool");
chai_1.should();
var Mock = (function () {
    function Mock() {
    }
    return Mock;
}());
;
var TestCommand = (function (_super) {
    __extends(TestCommand, _super);
    function TestCommand(keyword) {
        return _super.call(this, keyword) || this;
    }
    TestCommand.prototype.signature = function () {
        return [
            {
                name: 'arg1',
                description: 'The first arg',
                type: Command_1.ArgType.STRING
            },
            {
                name: 'arg2',
                description: 'The second arg',
                type: Command_1.ArgType.NUMBER
            },
            {
                name: 'arg3',
                description: 'The third arg',
                type: Command_1.ArgType.BOOLEAN
            }
        ];
    };
    TestCommand.prototype.execute = function (_a, bot) {
        var arg1 = _a.arg1, arg2 = _a.arg2, arg3 = _a.arg3;
        bot.result1 = arg1;
        bot.result2 = arg2;
        bot.result3 = arg3;
    };
    return TestCommand;
}(Command_1["default"]));
var DidRunCommand = (function (_super) {
    __extends(DidRunCommand, _super);
    function DidRunCommand() {
        return _super.call(this, 'didrun') || this;
    }
    DidRunCommand.prototype.signature = function () { return []; };
    ;
    DidRunCommand.prototype.execute = function (_a, obj) {
        obj.didRun = true;
    };
    return DidRunCommand;
}(Command_1["default"]));
var bot = new Mock;
var command = new TestCommand("test");
var pool = new CommandPool_1["default"](["!"]);
var reset = function () {
    bot = new Mock;
    command = new TestCommand("test");
    pool = new CommandPool_1["default"](["!"]);
    pool.register(command);
};
describe("Command Pool", function () {
    describe("#register", function () {
        it("should register a command", function () {
            var pool = new CommandPool_1["default"](["!"]);
            pool.register(new TestCommand("test"));
            Object.keys(pool.commands).length.should.be.equal(1);
        });
        it("should register multiple commands", function () {
            var pool = new CommandPool_1["default"](["!"]);
            pool.register(new TestCommand("test"));
            pool.register(new TestCommand("test2"));
            Object.keys(pool.commands).length.should.be.equal(2);
        });
        it("should not register two commands with the same keyword", function () {
            var pool = new CommandPool_1["default"](["!"]);
            pool.register(new TestCommand("test"));
            var wrongCall = function () { return pool.register(new TestCommand("test")); };
            wrongCall.should["throw"]();
        });
    });
    describe("#runFromMessage", function () {
        it("should not run regular messages", function () {
            var pool = new CommandPool_1["default"](["!"]);
            pool.register(new DidRunCommand);
            var o = { didRun: false };
            pool.runFromMessage('Regular another common message', o);
            o.didRun.should.be["false"];
        });
        it("should run non arguments command", function () {
            var pool = new CommandPool_1["default"](["!"]);
            pool.register(new DidRunCommand);
            var o = { didRun: false };
            pool.runFromMessage('!didrun', o);
            o.didRun.should.be["true"];
        });
        it("should not run when marker list is empty", function () {
            var pool = new CommandPool_1["default"]([]);
            pool.register(new DidRunCommand);
            var o = { didRun: false };
            pool.runFromMessage('!didrun', o);
            o.didRun.should.be["false"];
        });
        it("should not run when marker list contains only one empty string", function () {
            var pool = new CommandPool_1["default"]([""]);
            pool.register(new DidRunCommand);
            var o = { didRun: false };
            pool.runFromMessage('!didrun', o);
            o.didRun.should.be["false"];
        });
        it("should run with the correct arguments", function () {
            reset();
            pool.runFromMessage("!test test 3 false", bot);
            bot.result1.should.be.equal("test");
            bot.result2.should.be.equal(3);
            bot.result3.should.be["false"];
        });
        it("should run with the a quoted long string argument", function () {
            reset();
            pool.runFromMessage("!test 'testing a long string' 3 false", bot);
            bot.result1.should.be.equal("testing a long string");
            bot.result2.should.be.equal(3);
            bot.result3.should.be["false"];
        });
        it("should throw error with invalid number type", function () {
            reset();
            var wrongCall = function () { return pool.runFromMessage("!test test eight true", bot); };
            wrongCall.should["throw"]();
        });
        it("should throw error with invalid boolean type", function () {
            reset();
            var wrongCall = function () { return pool.runFromMessage("!test test 8 notbool", bot); };
            wrongCall.should["throw"]();
        });
        it("should throw error with fewer args", function () {
            reset();
            var wrongCall = function () { return pool.runFromMessage("!test test 5", bot); };
            wrongCall.should["throw"]();
        });
        it("should throw error with too many args", function () {
            reset();
            var wrongCall = function () { return pool.runFromMessage("!test test 2 true another", bot); };
            wrongCall.should["throw"]();
        });
    });
});
