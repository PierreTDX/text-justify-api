import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }
}, 20000);

afterAll(async () => {
    // Ferme la connexion Mongoose
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    // Arrête le serveur MongoDB en mémoire
    if (mongoServer) {
        await mongoServer.stop();
    }
});

afterEach(async () => {
    // Nettoie toutes les collections après chaque test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});