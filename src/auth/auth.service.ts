import { Injectable, Res } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Chat, ChatMeta, Conversations, message, UserInfo } from 'src/types';
import { Collection } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DatabaseService) {}

  userInfo: UserInfo = {
    username: '',
    password: '',
    chats: [],
  };

  sessions: object = {};

  counter: number = 0;

  getUsername(sessionId: string) {
    return this.sessions[sessionId];
  }

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
    return 'done';
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
          name: 'defalut',
          last_message: "Hey what's up ?",
          chat_id: '0',
        },
      ],
    };
    await usersCollection.insertOne(this.userInfo);
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
      if (user.username === username || user.password === password) {
        this.createSession(username, res);
        return res.json({ isExist: true, url: '../main.html' });
      }
    }

    return res.json({ isExist: false });
  }

  async chatList(username: string) {
    const usersCollection = this.getDb('users');
    const user = await usersCollection
      .find({ username }, { projection: { username: 1, chats: 1 } })
      .toArray();
    return user[0];
  }

  async getFriendName(chatId: string, sessionId: string) {
    const usersCollection = this.getDb('users');
    const username = this.getUsername(sessionId);
    const chats = await usersCollection
      .find({ username: username }, { projection: { chats: 1 } })
      .toArray();
    const index = chats[0].chats.findIndex((chat) => chat.chat_id === chatId);
    return chats[0].chats[index].name;
  }

  async showChat(chatId: string, sessionId: string) {
    const friendName = await this.getFriendName(chatId, sessionId);
    const chatCollection = this.getDb('conversations');
    const chats = await chatCollection.find({ chat_id: chatId }).toArray();
    console.log('The friend name is', friendName, chats);
    return { chatName: friendName, chats: chats };
  }

  async getChatId(to: string, username: string) {
    const usersCollection = this.getDb('users');
    const user = await usersCollection.findOne({ username });

    if (user) {
      const chat = user.chats.find((c: ChatMeta) => c.name === to);

      return chat?.chat_id ?? null;
    }

    return null;
  }

  async storeChatInDb(chat: Chat) {
    const conversations = this.getDb('conversations');
    conversations.insertOne(chat);
    return 'successfully stored!';
  }

  async storeChat({ to, msg }, username) {
    console.log('The values are', to, msg, username);
    const id = await this.getChatId(to, username);

    return this.storeChatInDb({ from: username, to, msg, chat_id: id });
  }

  searchFriends(username: string, name: string): object {
    const users = this.getDb('users');
    const value = users.find({ username: name });
    if (value) return { isExist: true };
    return { isExist: false };
  }

  async sentFollowRequest(username: string, name: string): Promise<string> {
    const db = this.dbService.getDb();
    const users: Collection<UserInfo> = db.collection('users');
    this.counter += 1;

    const chat: ChatMeta = {
      name,
      last_message: '',
      chat_id: this.counter.toString(),
    };

    const userChat: ChatMeta = {
      name: username,
      last_message: '',
      chat_id: this.counter.toString(),
    };

    await users.updateOne(
      { username },
      {
        $push: { chats: chat },
      },
    );

    await users.updateOne(
      { username: name },
      {
        $push: { chats: userChat },
      },
    );

    return 'request sent';
  }
}
