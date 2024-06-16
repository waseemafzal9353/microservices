"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const custom_errors_1 = require("./custom-errors");
class DatabaseConnectionError extends custom_errors_1.CustomError {
    constructor() {
        super("Error connecting db");
        this.statusCode = 500;
        this.reason = 'Error in connecting with database.';
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
