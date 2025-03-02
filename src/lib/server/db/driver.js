import { MongoClient } from 'mongodb';
import { hash } from 'bcrypt';
import { encryptValue, decryptValue } from '../encryption.js';

const MONGO_URI = 'mongodb://localhost:27017'; // Change if using a cloud DB
const DB_NAME = 'scones-ike-coffee';

class MongoDriver {
	constructor() {
		this.client = new MongoClient(MONGO_URI);
		this.db = null;
	}

	async hash(value) {
		const salt = 10
		return await hash(value, salt);
	}

	async connect(collectionName) {
		if (!this.db) {
			await this.client.connect();
			this.db = this.client.db(DB_NAME);
			console.log('✅ Connected to MongoDB');
		}
		return this.db.collection(collectionName);
	}

	async createUser(userData) {
		const collection = await this.connect("users");

		// get the password for hashing:
		const { password } = userData;

		// make email unique:
		collection.createIndex({ email: 1 }, { unique: true })

		// insert new user
		const result = await collection.insertOne(
			{
				...userData,
				password: await this.hash(password),
			}
		);

		return result.insertedId.toString(); // convert ObjectId to string for stringification
	}

	async getUserById(userId) {
		const collection = await this.connect("users");
		return collection.findOne({ userId });
	}

	async getUserByStripeId(stripeCustomerId) {
		const collection = await this.connect("users");
		return collection.findOne({ stripeCustomerId });
	}

	async updateUser(userId, updates) {
		const collection = await this.connect("users");
		return collection.updateOne({ userId }, { $set: updates });
	}

	async deleteUser(userId) {
		const collection = await this.connect("users");
		return collection.deleteOne({ userId });
	}

	async getUserByEmailAndPassword(email, password) {
		// first, hash the userId and password
		const hashedPw = this.hash(password);

		// then, verify that the user exists:
		const users = await this.connect("users");
		const user = await users.findOne({ email, password: hashedPw });

		if (user) {
			// if it exists, convert the _id field to string
			// and then return the user data
			const { _id } = user;
			delete user._id;
			user._id = _id.toString();

			return user;
		}

		return null; // user does not exist
	}

	async close() {
		await this.client.close();
		console.log('❌ MongoDB connection closed');
	}
}

export { MongoDriver };
