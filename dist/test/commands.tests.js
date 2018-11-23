"use strict";
exports.__esModule = true;
var ICommand_1 = require("../src/ICommand");
var chai_1 = require("chai");
var CommandPool_1 = require("../src/CommandPool");
chai_1.should();
var Mock = (function () {
    function Mock() {
    }
    return Mock;
}());
;
var TestCommand = (function () {
    function TestCommand(keyword) {
        this.keyword = keyword;
    }
    TestCommand.prototype.signature = function () {
        return [
            {
                name: 'arg1',
                description: 'The first arg',
                type: ICommand_1.ArgType.STRING
            },
            {
                name: 'arg2',
                description: 'The second arg',
                type: ICommand_1.ArgType.NUMBER
            },
            {
                name: 'arg3',
                description: 'The third arg',
                type: ICommand_1.ArgType.BOOLEAN
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
}());
describe("Testing the command pool", function () {
    var bot = new Mock;
    var command = new TestCommand("test");
    var pool = new CommandPool_1["default"](["!"]);
    pool.register(command);
    it("should run with the correct arguments", function () {
        pool.runFromMessage("!test test 3 false", bot);
        bot.result1.should.be.equal("test");
        bot.result2.should.be.equal(3);
        bot.result3.should.be["false"];
    });
    it("should not run with invalid number type", function () {
        var wrongCall = function () { return pool.runFromMessage("!test test eight true", bot); };
        wrongCall.should["throw"]();
    });
    it("should not run with invalid boolean type", function () {
        var wrongCall = function () { return pool.runFromMessage("!test test 8 notbool", bot); };
        wrongCall.should["throw"]();
    });
    it("should not run with fewer args", function () {
        var wrongCall = function () { return pool.runFromMessage("!test test 5", bot); };
        wrongCall.should["throw"]();
    });
    it("should not run with too many args", function () {
        var wrongCall = function () { return pool.runFromMessage("!test test 2 true another", bot); };
        wrongCall.should["throw"]();
    });
    it("should register two multiple commands with different keywords", function () {
        var anotherCommand = new TestCommand('test2');
        pool.register(anotherCommand);
        Object.keys(pool.commands).length.should.be.equal(2);
    });
    it("should not register two commands with the same keyword", function () {
        var anotherCommand = new TestCommand('test');
        var wrongCall = function () { return pool.register(anotherCommand); };
        wrongCall.should["throw"]();
    });
});
