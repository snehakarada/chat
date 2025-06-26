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
  signupUser(@Body() body: any, @Res() res: Response) {
    console.log('inside signup');
    return this.authService.signupUser(body.username, body.password, res);
  }

  @Post('/signin')
  signinUser(@Body() body: any, @Res() res: Response) {
    return this.authService.signinUser(body.username, body.password, res);
  }

  @Get('/chat-list')
  async getFriends(@Req() req: Request) {
    const username = req.cookies.username;
    const frnds = await (await this.authService.getFriends(username)).toArray();
    console.log('frnds :: ', frnds[0]);

    return frnds[0];
  }

  @Get('/chat/:chatId')
  showChat(@Param('chatId') chatId: string, @Req() req: Request) {
    return this.authService.showChat(chatId, req.cookies.sessionId);
  }

  @Post('/storechat')
  stroreChat(@Body() data, @Req() req: Request) {
    const username = req.cookies.username;
    return this.authService.storeChat(data, username);
  }
}
