import { Body, Injectable, NestMiddleware, Res } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  }
}

@Injectable()
export class CreateSession implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.cookie('username', req.body.username);
    console.log('cookie create bro');
    next();
  }
}
