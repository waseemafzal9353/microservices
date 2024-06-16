import { CustomError } from "./custom-errors";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super("Not Authorized")
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeError(): { message: string; field?: string | undefined; }[] {
        return [{message: "Not authorized"}]
    }
}