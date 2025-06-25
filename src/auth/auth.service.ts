import { Injectable, Res } from '@nestjs/common';
import { ConnectionCheckOutStartedEvent } from 'mongodb';
import { userInfo } from 'os';
import { DatabaseService } from 'src/database/database.service';
import { Conversations, message, UserInfo } from 'src/types';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DatabaseService) {}

  userInfo: UserInfo = {
    username: '',
    password: '',
    chats: [],
  };

  getDb(dbName) {
    const db = this.dbService.getDb();
    return db.collection(dbName);
  }

  async signupUser(username: string, password: string) {
    const db = this.dbService.getDb();
    const usersCollection = this.getDb('users');
    const chatCollection = db.collection('conversations');

    this.userInfo = {
      username,
      password,
      chats: [
        {
          name: 'bhagya',
          last_message: "Hey what's up ?",
          chat_id: '1',
        },
        {
          name: 'abc',
          last_message: 'Hey there !',
          chat_id: '2',
        },
        {
          name: 'Guy 1',
          last_message: 'Hi',
          chat_id: '3',
        },
      ],
    };

    await usersCollection.insertOne(this.userInfo);
    await chatCollection.insertOne({
      from: 'bhagya',
      to: 'malli',
      msg: 'hello',
      chat_id: 1,
    });

    const users = usersCollection.find();
    for await (const user of users) {
    }

    return 'successfully stored';
  }

  async signinUser(username: string, password: string, res) {
    const usersCollection = this.getDb('users');
    const users = usersCollection.find();

    for await (const user of users) {
      if (user.username === username && user.password === password) {
        res.cookie('username', username);
        return res.json({ isExist: true });
      }
    }

    return res.json({ isExist: false });
  }

  getMessage(username: string): Array<message> {
    return [{ from: 'sneha', to: username, message: 'hello' }];
  }

  async getFriends(username: string) {
    const usersCollection = this.getDb('users');
    const users = usersCollection.find();

    for await (const user of users) {
      if (user.username === username) {
        return user.frnds;
      }
    }

    return ['not found'];
  }

  async showChat(friendName: string, userName: string) {
    const db = this.dbService.getDb();
    const usersCollection = db.collection('users');
    const users = usersCollection.find();
    let conversationId: number = 0;
    for await (const user of users) {
      if (user.username === userName) {
        conversationId = user.chats[friendName];
        break;
      }
    }
    const chatCollection = db.collection('conversations');
    const chats = await chatCollection.find().toArray();
    for (const chat of chats) {
      if (Number(Object.keys(chat)[0]) === conversationId) {
        return chat[conversationId];
      }
    }
  }
  async getChatId(from, username) {
    const usersCollection = this.getDb('users');
    const users = usersCollection.find();

    for await (const user of users) {
      if (user.username === username) {
        return user.chats[from];
      }
    }
  }

  async storeChatInDb(chat) {
    const conversations = this.getDb('conversations');
    conversations.insertOne(chat);
    return 'successfully stored!';
  }

  async storeChat({ from, to, msg }, username) {
    const id = await this.getChatId(from, username);
    return this.storeChatInDb({ from, to, msg, chat_id: id });
  }
}
