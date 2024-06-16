import { Ticket } from "../tickets"

it('implements optimistic concurrency control', async () =>{
    const ticket = Ticket.build({
        title: 'concert',
        price: 12,
        userId: '123'
    });

    await ticket.save();

const firstInstance = await Ticket.findById(ticket.id);
const secondInstance = await Ticket.findById(ticket.id);

firstInstance!.set({price: 20});
secondInstance!.set({price: 34})
await firstInstance!.save();
try {
    await secondInstance!.save();
    
} catch (error) {
    return
}

throw new Error('Should not reach this point')

});

it('increments version number on muliple save', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 12,
        userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0)

    await ticket.save();
    expect(ticket.version).toEqual(1)

    await ticket.save();
    expect(ticket.version).toEqual(2)
})