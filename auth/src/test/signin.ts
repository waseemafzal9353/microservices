import request from 'supertest';
import { app } from '../app';


export const signin = async () => {
    const email: string = "test@test.com";
    const password: string = 'password';

    const response = await request(app)
    .post('/api/users/signup')
    .send({email, password})
    .expect(201);

    const cookie = response.get('Set-Cookie');
    return cookie;
}