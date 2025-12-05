import { getDb } from '../db';
import bcrypt from 'bcryptjs';

export interface UserDocument {
  _id?: string;
  name: string;
  email: string;
  twitterUrl: string;
  password: string; // hashed
  createdAt: Date;
}

export class User {
  static async create(data: {
    name: string;
    email: string;
    twitterUrl: string;
    password: string;
  }): Promise<UserDocument> {
    const db = await getDb();
    const usersCollection = db.collection<UserDocument>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user: UserDocument = {
      name: data.name,
      email: data.email,
      twitterUrl: data.twitterUrl,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(user);
    return {
      ...user,
      _id: result.insertedId.toString(),
    };
  }

  static async findByEmail(email: string): Promise<UserDocument | null> {
    const db = await getDb();
    const usersCollection = db.collection<UserDocument>('users');
    return await usersCollection.findOne({ email });
  }

  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

