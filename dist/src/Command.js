"use strict";
exports.__esModule = true;
var ArgType;
(function (ArgType) {
    ArgType[ArgType["NUMBER"] = 0] = "NUMBER";
    ArgType[ArgType["STRING"] = 1] = "STRING";
    ArgType[ArgType["BOOLEAN"] = 2] = "BOOLEAN";
})(ArgType = exports.ArgType || (exports.ArgType = {}));
;
var Command = (function () {
    function Command(keyword) {
        this.keyword = keyword;
    }
    Command.prototype.description = function () {
        return "";
    };
    return Command;
}());
exports["default"] = Command;
