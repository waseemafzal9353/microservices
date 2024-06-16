import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { NotFoundError, errorHandler } from '@hashbad/common';
import cookieSession from 'cookie-session';

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

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all('*', async (req, res)=>{
    throw new NotFoundError
})

app.use(errorHandler);

export {app}