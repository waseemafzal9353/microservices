import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
console.clear();
const stan = nats.connect('ticketing', 'abcedf', {
    url: 'http://localhost:4222'
});

stan.on('connect', async ()=>{
    console.log('publisher streaming now');

    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });

    // stan.publish('ticket:created', data, ()=>{
    //     console.log("event published");
    // })

    const publisher = new TicketCreatedPublisher(stan);
    await publisher.publish({
        id: '123',
        title: 'concert',
        price: 123
    });
})