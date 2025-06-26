import { Injectable, Res } from '@nestjs/common';
import { urlencoded } from 'express';
import { ConnectionCheckOutStartedEvent } from 'mongodb';
import { DatabaseService } from 'src/database/database.service';
import { Chat, ChatMeta, Conversations, message, UserInfo } from 'src/types';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DatabaseService) {}

  userInfo: UserInfo = {
    username: '',
    password: '',
    chats: [],
  };

  sessions: object = {};

  getDb(dbName) {
    const db = this.dbService.getDb();
    return db.collection(dbName);
  }

  async isNameValid(username: string, usersCollection) {
    const values = await usersCollection.find({ username: username }).toArray();
    if (values.length > 0) {
      return false;
    }
    return true;
  }

  createSession = (username: string, res) => {
    const cookie = Math.random().toString(36).substring(2);
    res.cookie('sessionId', cookie);
    this.sessions[cookie] = username;
    console.log(this.sessions);
  };

  async signupUser(username: string, password: string, res) {
    const db = this.dbService.getDb();
    const usersCollection = this.getDb('users');
    const chatCollection = this.getDb('conversations');
    const value = await this.isNameValid(username, usersCollection);

    if (!value) {
      return res.json({
        isAccountCreated: false,
        message: `${username} is already used`,
        url: null,
      });
    }

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

    return res.json({
      isAccountCreated: true,
      message: 'Account created successfully',
      url: '../signin.html',
    });
  }

  async signinUser(username: string, password: string, res) {
    const usersCollection = this.getDb('users');
    const users = usersCollection.find();

    for await (const user of users) {
      if (!(user.username === username && user.password === password)) {
        return res.json({ isExist: false });
      }
    }

    this.createSession(username, res);

    return res.json({ isExist: true, url: '../main.html' });
  }

  async getFriends(username: string) {
    const usersCollection = this.getDb('users');
    const user = usersCollection.find(
      { username },
      { projection: { username: 1, chats: 1 } },
    );

    console.log('user-info :: ', user);
    return user;
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
    const user = await usersCollection.findOne({ username });

    if (user) {
      const chat = user.chats.find((c: ChatMeta) => c.name === from);

      return chat?.chat_id ?? null;
    }

    return null;
  }

  async storeChatInDb(chat: Chat) {
    const conversations = this.getDb('conversations');
    conversations.insertOne(chat);

    return 'successfully stored!';
  }

  async storeChat({ from, to, msg }, username) {
    const id = await this.getChatId(from, username); //u can validate is from(frnd) is present or not by checking Id

    return this.storeChatInDb({ from, to, msg, chat_id: id });
  }
}
