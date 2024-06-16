import { CustomError } from "./custom-errors";
export declare class NotFoundError extends CustomError {
    statusCode: number;
    constructor();
    serializeError(): {
        message: string;
    }[];
}
