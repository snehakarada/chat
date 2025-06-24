import { Injectable, Res } from '@nestjs/common';
import { ConnectionCheckOutStartedEvent } from 'mongodb';
import { DatabaseService } from 'src/database/database.service';
import { Conversations, message, UserInfo } from 'src/types';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DatabaseService) {}

  userInfo: UserInfo = {
    username: '',
    password: '',
    frnds: [],
    chats: {},
  };

  getDb(dbName) {
    const db = this.dbService.getDb();
    return db.collection(dbName);
  }

  async signupUser(username: string, password: string) {
    console.log('inside signup user');
    const db = this.dbService.getDb();
    const usersCollection = this.getDb('users');
    const chatCollection = db.collection('conversations');

    this.userInfo = {
      username,
      password,
      frnds: ['bhagya', 'Hima Sai', 'Jayanth', 'Pradeep', 'Malli'],
      chats: {
        bhagya: 1,
      },
    };

    await usersCollection.insertOne(this.userInfo);
    await chatCollection.insertOne({
      1: [
        { from: 'bhagya', to: 'malli', msg: 'hello' },
        { from: 'malli', to: 'bhagya', msg: 'Hey Hi' },
      ],
    });

    console.log('hello');
    const users = usersCollection.find();
    for await (const user of users) {
      console.log('users are', user);
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
    console.log('inside getChatId');
    const usersCollection = this.getDb('users');
    const users = usersCollection.find();

    for await (const user of users) {
      console.log(
        'username-cookie :: ',
        username,
        'user-username :: ',
        user.username,
      );

      if (user.username === username) {
        return user.chats[from];
      }
    }
  }

  async storeChatInDb(id, chat) {
    const conversationsCollection = this.getDb('conversations');
    const conversations = conversationsCollection.find();

    for await (const conversation of conversations) {
      conversation[id].push(chat);
    }

    return 'successfully stored!';
  }

  async storeChat({ from, to, msg }, username) {
    console.log('inside sercivce--storechart');
    const id = await this.getChatId(from, username);

    return this.storeChatInDb(id, { from, to, msg });
  }
}
