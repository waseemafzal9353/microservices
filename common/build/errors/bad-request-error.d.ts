import { CustomError } from "./custom-errors";
export declare class BadRequestError extends CustomError {
    message: string;
    statusCode: number;
    constructor(message: string);
    serializeError(): {
        message: string;
        field?: string | undefined;
    }[];
}
