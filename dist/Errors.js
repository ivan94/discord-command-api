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
var KeywordBoundError = (function (_super) {
    __extends(KeywordBoundError, _super);
    function KeywordBoundError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return KeywordBoundError;
}(Error));
exports.KeywordBoundError = KeywordBoundError;
var InvalidCallError = (function (_super) {
    __extends(InvalidCallError, _super);
    function InvalidCallError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidCallError;
}(Error));
exports.InvalidCallError = InvalidCallError;
var InvalidTypeError = (function (_super) {
    __extends(InvalidTypeError, _super);
    function InvalidTypeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidTypeError;
}(Error));
exports.InvalidTypeError = InvalidTypeError;
