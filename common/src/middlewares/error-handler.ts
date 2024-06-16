import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-errors";


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof CustomError) {
        return res.status(400).send({errors: err.serializeError()})
    }
    console.error(err);
    res.status(400).send({
        errors: [{message: "something went wrong!"}] 
    })
}