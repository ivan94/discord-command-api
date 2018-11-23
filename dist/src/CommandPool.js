"use strict";
exports.__esModule = true;
var ICommand_1 = require("./ICommand");
var Errors_1 = require("./Errors");
var CommandPool = (function () {
    function CommandPool(markers) {
        this.commands = {};
        this.markers = markers;
    }
    CommandPool.prototype.register = function (command) {
        if (this.commands[command.keyword]) {
            throw new Errors_1.KeywordBoundError;
        }
        this.commands[command.keyword] = command;
    };
    CommandPool.prototype.runFromMessage = function (message, ref) {
        if (!message) {
            return;
        }
        var cleanMessage = this.removeMarker(message);
        if (cleanMessage) {
            var words = cleanMessage.split(/\s/);
            var keyword = words[0];
            this.run(this.commands[keyword], words, ref);
        }
    };
    CommandPool.prototype.run = function (command, words, ref) {
        command.execute(this.buildArgs(command, words), ref);
    };
    CommandPool.prototype.buildArgs = function (command, words) {
        var _this = this;
        try {
            var signature = command.signature();
            var args_1 = {};
            if (signature.length != (words.length - 1)) {
                throw new Errors_1.InvalidCallError("Arguments don't match the signature");
            }
            signature.forEach(function (arg, i) {
                args_1[arg.name] = _this.convertArg(words[i + 1], arg.type);
            });
            return args_1;
        }
        catch (error) {
            throw new Errors_1.InvalidCallError(error);
        }
    };
    CommandPool.prototype.convertArg = function (value, type) {
        switch (type) {
            case ICommand_1.ArgType.BOOLEAN:
                if (value != 'true' && value != 'false') {
                    throw new Errors_1.InvalidCallError(value + " should be boolean");
                }
                return value == 'true';
            case ICommand_1.ArgType.STRING:
                return value;
            case ICommand_1.ArgType.NUMBER:
                var result = Number(value);
                if (isNaN(result)) {
                    throw new Errors_1.InvalidCallError(value + " should be a number");
                }
                return result;
            default:
                throw new Errors_1.InvalidTypeError;
        }
    };
    CommandPool.prototype.removeMarker = function (message) {
        return this.markers.reduce(function (acc, marker) { return message.startsWith(marker) ? message.substring(marker.length) : acc; }, null);
    };
    return CommandPool;
}());
exports["default"] = CommandPool;
