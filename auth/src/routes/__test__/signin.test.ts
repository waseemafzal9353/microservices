import request from 'supertest'
import { app } from '../../app'

it('fails when false email is supplied', async () => {
    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(400);
});

it('fails when false password is supplied', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: "test@test.com",
        password: "password"
    }).expect(201)

    await request(app)
    .post('/api/users/signin')
    .send({
        email: "test@test.com",
        password: "jkkhjkhjgjfjhfjhgfg"
    }).expect(400)
});

it('responds with a cookie upon successful signin', async () => {
        await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
    });

    it('fails when false password is supplied', async () => {
        await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        }).expect(201)
    
        const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "password"
        }).expect(200);

        expect(response.get('Set-Cookie')).toBeDefined();
})