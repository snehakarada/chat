import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService, message } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  logger() {
    console.log('inside logger');
  }

  @Post('/signup')
  signupUser(@Body() body: any) {
    return this.authService.signupUser(body.username, body.password);
  }

  @Post('/signin')
  async signinUser(@Body() body: any) {
    const value = await this.authService.signinUser(
      body.username,
      body.password,
    );

    return value;
  }

  @Get('/getmessage')
  getmessages(@Req() req: any): any {
    console.log('hello');
    // const username = res.cookies;
    console.log('The cookies are', req.cookies.username);
    return this.authService.getMessage(req.cookies.username);
  }
}
