import { Subjects } from "./subjects";

export interface PaymentCreatedEvent {
    subject: Subjects.PaymentCreated;
    data: {
        id: string,
        ordreId: string,
        stripeId: string
    }
}