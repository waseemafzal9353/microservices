import { CustomError } from "./custom-errors";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error in connecting with database.'
    constructor(){
        super("Error connecting db")
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeError ()
    {
        return [{message: this.message}]
    }
}