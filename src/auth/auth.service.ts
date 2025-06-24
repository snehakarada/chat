import { Injectable, Res } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { message, UserInfo } from 'src/types';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DatabaseService) {}

  userInfo: UserInfo = {
    username: '',
    password: '',
    frnds: [],
    chats: {},
  };

  async signupUser(username: string, password: string) {
    console.log('inside signup user');
    const db = this.dbService.getDb();
    const usersCollection = db.collection('users');
    this.userInfo = {
      username,
      password,
      frnds: ['Bhagya', 'Hima Sai', 'Jayanth', 'Pradeep', 'Malli'],
      chats: {
        bhagya: [{ from: 'bhagya', to: username, message: 'hello bacche' }],
      },
    };

    await usersCollection.insertOne(this.userInfo);
    console.log('hello');
    const users = usersCollection.find();
    for await (const user of users) {
      console.log('users are', user);
    }

    return 'successfully stored';
  }

  async signinUser(username: string, password: string, res) {
    const db = this.dbService.getDb();
    const usersCollection = db.collection('users');
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
    const db = this.dbService.getDb();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find().toArray();

    for (const user of users) {
      if (user.username === username) {
        console.log('match found');
        return user.frnds;
      }
    }

    return ['not found'];
  }

  showChat() {}
}
