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
  signinUser(@Body() body: any, @Res() res: Response) {
    return this.authService.signinUser(body.username, body.password, res);
  }

  @Get('/getmessage')
  getmessages(@Req() req: any): any {
    return this.authService.getMessage(req.cookies.username);
  }
}
