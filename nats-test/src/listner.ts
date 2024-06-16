import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListner } from './events/ticket-created-listner';
console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', ()=>{
    console.log("listner streaming now");

    stan.on('close', ()=>{
        console.log('NATS connection closed');
        process.exit();
    })
    new TicketCreatedListner(stan).listen()
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());




