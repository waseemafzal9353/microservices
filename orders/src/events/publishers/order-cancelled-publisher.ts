import { OrderCancelledEvent, Publisher, Subjects } from "@hashbad/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}