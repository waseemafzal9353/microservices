import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { NotFoundError, currentUser, errorHandler } from '@hashbad/common';
import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new';


const app = express();
app.set('trust-proxy', true);
app.use(json());
app.use(
    cookieSession({
        name: 'session',
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);
app.use(currentUser)
app.use(createChargeRouter);

app.all('*', async (req, res)=>{
    throw new NotFoundError
})

app.use(errorHandler);

export {app}