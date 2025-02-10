import { MongoClient } from 'mongodb';
import { MONGO_URI, MONGO_DB_NAME } from '$env/static/private'

let client;
let db;

const uri = MONGO_URI; // Add your MongoDB connection URI to .env
const dbName = MONGO_DB_NAME; // Add your database name to .env

export async function connectToDatabase() {
    if (!client) {
        try {
            client = new MongoClient(uri);
            await client.connect();
            db = client.db(dbName);
            console.log('🚀 Connected to MongoDB');
        } catch (err) {
            console.error('❌ Failed to connect to MongoDB:', err);
            throw err;
        }
    }
    return db;
}

export function getCollection(collectionName) {
    if (!db) throw new Error('Database not initialized. Call connectToDatabase first.');
    return db.collection(collectionName);
}

export async function disconnectFromDatabase() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('👋 Disconnected from MongoDB');
    }
}
