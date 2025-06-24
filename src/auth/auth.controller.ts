import { Controller, Get, Post, Body, Res, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  logger() {
    console.log('inside logger');
  }

  @Post('/signup')
  signupUser(@Body() body: any) {
    console.log('inside signup user controller');
    return this.authService.signupUser(body.username, body.password);
  }

  @Post('/signin')
  signinUser(@Body() body: any, @Res() res: Response) {
    console.log('inside signin', body.username, body.password);
    return this.authService.signinUser(body.username, body.password, res);
  }

  @Get('/getmessage')
  async getmessages(@Req() req: any): Promise<any> {
    return await this.authService.getMessage(req.cookies.username);
  }

  @Get('/getfriends')
  getFriends(@Req() req: Request) {
    const username = req.cookies.username;
    const frnds = this.authService.getFriends(username);

    return frnds;
  }

  @Get('/chat/:friendName')
  showChat(@Param('friendName') name: string) {
    console.log('The friend name is', name);
    return 'done';
  }
}
