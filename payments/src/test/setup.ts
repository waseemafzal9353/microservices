import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


declare global {
    namespace NodeJS {
      interface Global {
        signin(id?: string): string[]
      }
    }
  }

jest.mock('../nats-wrapper');
let mongo: any;
process.env.STRIPE_KEY='sk_test_51NTSvpLrLi4CYk20OThyckBbGnkp2EiCAUYzf6JcsBKONZa5sjeHRKX3yvBjT618okpYlZ6p99xYgwLnTyB7TtwJ00Hx8zeW1n'
beforeAll(async ()=>{
  jest.clearAllMocks();
    process.env.JWT_KEY = 'asdf'
    mongo = await MongoMemoryServer.create();

    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({})
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close()
});

global.signin = (id?:string) => {
const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@tes.com'
};

const token = jwt.sign(payload, process.env.JWT_KEY!)
const session = {jwt: token};
const sessionJson = JSON.stringify(session);
const base64 = Buffer.from(sessionJson).toString('base64');

return [`express:sess=${base64}`]
}
