import { Injectable, Res } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { message, UserInfo } from 'src/types';
import { console } from 'inspector';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DatabaseService) {}
  userInfo: ArrayLike<UserInfo> = [];

  async signupUser(username: string, password: string) {
    const db = this.dbService.getDb();
    const usersCollection = db.collection('users');
    this.userInfo = [
      {
        username,
        password,
        frnds: ['Bhagya', 'Hima Sai', 'Jayanth', 'Pradeep', 'Malli'],
        chats: [],
      },
    ];

    await usersCollection.insertOne(this.userInfo);

    const users = usersCollection.find();
    for await (const user of users) console.log('users are', user);
    return 'successfully stored';
  }

  async signinUser(username: string, password: string, res) {
    const db = this.dbService.getDb();
    const usersCollection = db.collection('users');
    const users = usersCollection.find();

    for await (const user of users) {
      if (user.name === username && user.password === password) {
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
    console.log('inside getfrniends');
    const db = this.dbService.getDb();
    const usersCollection = db.collection('users');
    const users = usersCollection.find();
    console.log('users--->', users);
    for await (const user of users) {
      console.log(user);
      if (user.username === username) {
        return user.frnds;
      }
    }
  }
}
