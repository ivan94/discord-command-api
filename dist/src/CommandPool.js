"use strict";
exports.__esModule = true;
var stringArgv = require("string-argv");
var Command_1 = require("./Command");
var Errors_1 = require("./Errors");
var CommandPool = (function () {
    function CommandPool(markers) {
        this.commands = {};
        this.markers = markers.filter((function (s) { return s.match(/^\s*$/) === null; }));
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
            var argv = stringArgv(cleanMessage);
            var keyword = argv[0];
            this.run(this.commands[keyword], argv, ref);
        }
    };
    CommandPool.prototype.run = function (command, argv, ref) {
        command.execute(this.buildArgs(command, argv), ref);
    };
    CommandPool.prototype.buildArgs = function (command, argv) {
        var _this = this;
        try {
            var signature = command.signature();
            var args_1 = {};
            if (signature.length != (argv.length - 1)) {
                throw new Errors_1.InvalidCallError("Arguments don't match the signature");
            }
            signature.forEach(function (arg, i) {
                args_1[arg.name] = _this.convertArg(argv[i + 1], arg.type);
            });
            return args_1;
        }
        catch (error) {
            throw new Errors_1.InvalidCallError(error);
        }
    };
    CommandPool.prototype.convertArg = function (value, type) {
        switch (type) {
            case Command_1.ArgType.BOOLEAN:
                if (value != 'true' && value != 'false') {
                    throw new Errors_1.InvalidCallError(value + " should be boolean");
                }
                return value == 'true';
            case Command_1.ArgType.STRING:
                return value;
            case Command_1.ArgType.NUMBER:
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
