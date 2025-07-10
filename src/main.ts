import { json, urlencoded } from 'express';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { setupStatic } from './serve-static';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  if(process.env.NODE_ENV === 'production') {
    setupStatic(app);
  }
  app.setGlobalPrefix('api');
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
