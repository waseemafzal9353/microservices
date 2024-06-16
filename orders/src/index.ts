import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListner } from './events/listners/ticket-created-listner';
import { TicketUpdatedListner } from './events/listners/ticket-updated-listner';
import { ExpirationCompleteListener } from './events/listners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listners/payment-created-listener';

const start = async () => {
    console.log("Starting app...");
    
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined")
    };
    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI must be defined")
    }

    if(!process.env.NATS_CLIENT_ID){
        throw new Error("NATS_CLIENT_ID must be defined")
    }

    if(!process.env.NATS_URL){
        throw new Error("NATS_URL must be defined")
    }

    if(!process.env.NATS_CLUSTER_ID){
        throw new Error("NATS_CLUSTER_ID must be defined")
    }
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, 
            process.env.NATS_CLIENT_ID, 
            process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATs closing...');
            process.exit()
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new TicketCreatedListner(natsWrapper.client).listen();
        new TicketUpdatedListner(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to mongodb")
    } catch (error) {
        console.error(error)
    }
    app.listen(3000, () => { console.log('listening on port 3000!!!!') })

}
start();