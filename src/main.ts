import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: 'http://localhost:5173', credentials: true });
  // app.enableCors({ origin: 'http://10.136.20.215:5173', credentials: true });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
