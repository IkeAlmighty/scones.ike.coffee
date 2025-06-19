import mongoose from 'mongoose';

import { MONGODB_URI } from '$env/static/private';

// Avoid multiple connections in dev (hot reloading issue)
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
	}

	cached.conn = await cached.promise;
	return cached.conn;
}
