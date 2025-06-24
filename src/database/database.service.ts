import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();


@Injectable()
export class DatabaseService implements OnModuleInit {
  private client: MongoClient;
  private db: Db;

  async onModuleInit() {
    this.client = new MongoClient(process.env.MONGODB_URI!);
    await this.client.connect();
    this.db = this.client.db(process.env.MONGODB_NAME);
    console.log('✅ MongoDB connected');
  }

  getDb(): Db {
    return this.db;
  }
}