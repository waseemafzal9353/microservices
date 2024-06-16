import { ExpirationCompleteEvent, Publisher, Subjects } from "@hashbad/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}