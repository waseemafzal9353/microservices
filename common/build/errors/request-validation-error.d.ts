import { ValidationError } from "express-validator";
import { CustomError } from "./custom-errors";
export declare class RequestValidationError extends CustomError {
    errors: ValidationError[];
    statusCode: number;
    constructor(errors: ValidationError[]);
    serializeError(): {
        message: string;
        field: "alternative" | "alternative_grouped" | "unknown_fields" | "field";
    }[];
}
