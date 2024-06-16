import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin';

it("responds with details about current user", async () => {
    const cookie = await signin() as string[];

    const response = await request(app)
    .get('/api/users/currentUser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
expect(response.body.currentUser.email).toEqual('test@test.com')
});

it('returns null if not authenticated', async () => {
    const response = await request(app)
    .get('/api/users/currentUser')
    .send()
    .expect(200);

    expect(response.body.currentUser).toEqual(null);
})