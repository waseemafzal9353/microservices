import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/tickets';


it('returns 404 if the provided id does not exist', async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app).put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
        title: 'kjjlkhk',
        price: 30
    })
    .expect(404)
})

it('returns 401 if the user is not authenticated', async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app).put(`/api/tickets/${id}`)
    .send({
        title: 'kjjlkhk',
        price: 30
    })
    .expect(404)
})

it('returns 401 if the user does not own the ticket', async ()=>{
    const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
        title: 'kjhkjhkh',
        price: 30
    });

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', global.signin()).send({
        title: 'llhllhlj',
        price: 100
    }).expect(401)
})

it('returns 400 for invalid request', async () => {
const cookie = global.signin();
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
        title: 'kjhkjhkh',
        price: 30
    });

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: '',
        price: 20
    }).expect(400)

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'ljlkjl',
        price: -20
    }).expect(400)
})

it('returns 200 with a successful ticket update', async()=>{
    const cookie = global.signin();
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
        title: 'kjhkjhkh',
        price: 30
    });

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'new title',
        price: 300
    }).expect(200);

    const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`)
    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(300);
});

it('publishes an event', async () =>{
    const cookie = global.signin();
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
        title: 'kjhkjhkh',
        price: 30
    });

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'new title',
        price: 300
    }).expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
    const cookie = global.signin();
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
        title: 'kjhkjhkh',
        price: 30
    });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()});
    await ticket!.save()

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'new title',
        price: 300
    }).expect(400);
})