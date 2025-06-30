import { Controller, Get, Post, Body, Res, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  logger() {
    console.log('inside logger');
  }

  @Get('/me')
  currentUser(@Req() req: Request) {
    const sessionId = req.cookies.sessionId;
    const username = this.authService.getUsername(sessionId);
    return { username };
  }

  @Post('/signup')
  signupUser(@Body() body: any, @Res() res: Response) {
    return this.authService.signupUser(body.username, body.password, res);
  }

  @Post('/signin')
  signinUser(@Body() body: any, @Res() res: Response) {
    return this.authService.signinUser(body.username, body.password, res);
  }

  @Get('/chat-list')
  async getFriends(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.cookies.sessionId;
    const username = this.authService.getUsername(sessionId);
    const frnds = await this.authService.chatList(username);

    res.status(200).json({ data: frnds, success: true });
  }

  @Get('/chat/:chatId')
  showChat(@Param('chatId') chatId: string, @Req() req: Request) {
    console.log('chat id', chatId);
    return this.authService.showChat(chatId, req.cookies.sessionId);
  }

  @Post('/storechat')
  stroreChat(@Body() data: any, @Req() req: Request) {
    console.log('hello inside store chat');
    const sessionId = req.cookies.sessionId;

    const username = this.authService.getUsername(sessionId);
    console.log('body is', data);
    return this.authService.storeChat(data, username);
  }

  @Get('/search/:name')
  searchFriends(@Param('name') name: string, @Req() req: Request) {
    const username = this.authService.getUsername(req.cookies.sessionId);
    return this.authService.searchFriends(username, name);
  }

  @Get('/request/:name')
  sentFollowRequest(@Param('name') name: string, @Req() req: Request) {
    const username = this.authService.getUsername(req.cookies.sessionId);
    return this.authService.sentFollowRequest(username, name);
  }
}
