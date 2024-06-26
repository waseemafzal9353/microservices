"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const custom_errors_1 = require("./custom-errors");
class NotFoundError extends custom_errors_1.CustomError {
    constructor() {
        super("Route not found");
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeError() {
        return [{ message: 'Not Found' }];
    }
}
exports.NotFoundError = NotFoundError;
