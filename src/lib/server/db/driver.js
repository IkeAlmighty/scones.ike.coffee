import { MongoClient } from 'mongodb';

const MONGO_URI = 'mongodb://localhost:27017'; // Change if using a cloud DB
const DB_NAME = 'scones-ike-coffee';
const COLLECTION_NAME = 'users';

class MongoDriver {
	constructor() {
		this.client = new MongoClient(MONGO_URI);
		this.db = null;
	}

	async connect() {
		if (!this.db) {
			await this.client.connect();
			this.db = this.client.db(DB_NAME);
			console.log('✅ Connected to MongoDB');
		}
		return this.db.collection(COLLECTION_NAME);
	}

	async createUser(userData) {
		const collection = await this.connect();
		const result = await collection.insertOne(userData);
		return result.insertedId;
	}

	async getUserById(userId) {
		const collection = await this.connect();
		return collection.findOne({ userId });
	}

	async getUserByStripeId(stripeCustomerId) {
		const collection = await this.connect();
		return collection.findOne({ stripeCustomerId });
	}

	async updateUser(userId, updates) {
		const collection = await this.connect();
		return collection.updateOne({ userId }, { $set: updates });
	}

	async deleteUser(userId) {
		const collection = await this.connect();
		return collection.deleteOne({ userId });
	}

	async close() {
		await this.client.close();
		console.log('❌ MongoDB connection closed');
	}
}

export { MongoDriver };
