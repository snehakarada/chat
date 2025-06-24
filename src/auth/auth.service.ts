import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

export interface message {
  from: string;
  to: string;
  message: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DatabaseService) {}

  async signupUser(username: string, password: string) {
    console.log('hello friends sign up in controller');
    const db = this.dbService.getDb();
    const usersCollection = db.collection('users');

    await usersCollection.insertOne({
      name: username,
      password: password,
    });

    const users = usersCollection.find();
    for await (const user of users) console.log('users are', user);
    return 'successfully stored';
  }

  async signinUser(username: string, password: string) {
    console.log('hello friends sigin in controller');
    const db = this.dbService.getDb();
    const usersCollection = db.collection('users');
    const users = usersCollection.find();
    for await (const user of users) {
      if (user.name === username && user.password === password) {
        return { isExist: true };
      }
    }

    return { isExist: false };
  }

  getMessage(username: string): Array<message> {
    return [{ from: 'sneha', to: username, message: 'hello' }];
  }
}
