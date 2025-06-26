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

  @Get('/getfriends')
  getFriends(@Req() req: Request) {
    const username = req.cookies.username;
    const frnds = this.authService.getFriends(username);

    return frnds;
  }

  @Get('/chat/:friendName')
  showChat(@Param('friendName') name: string, @Req() req: Request) {
    return this.authService.showChat(name, req.cookies.username);
  }

  @Post('/storechat')
  stroreChat(@Body() data, @Req() req: Request) {
    const username = req.cookies.username;
    return this.authService.storeChat(data, username);
  }
}
