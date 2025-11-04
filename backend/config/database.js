import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.DATABASE_URL ||
      process.env.DB_URI;

    if (!mongoUri || typeof mongoUri !== 'string' || mongoUri.trim().length === 0) {
      throw new Error(
        'MongoDB connection string missing. Set one of: MONGO_URI, MONGODB_URI, DATABASE_URL, or DB_URI in your environment.'
      );
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;