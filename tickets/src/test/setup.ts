import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


declare global {
    namespace NodeJS {
      interface Global {
        signin(): string[]
      }
    }
  }

jest.mock('../nats-wrapper');
let mongo: any;

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

global.signin = () => {
const payload = {
    id:new mongoose.Types.ObjectId().toHexString(),
    email: 'test@tes.com'
};

const token = jwt.sign(payload, process.env.JWT_KEY!)
const session = {jwt: token};
const sessionJson = JSON.stringify(session);
const base64 = Buffer.from(sessionJson).toString('base64');

return [`express:sess=${base64}`]
}
