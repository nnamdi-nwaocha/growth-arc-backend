import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const frontendUrl = configService.getOrThrow<string>('FRONTEND_URL');

  // Enable CORS
  app.enableCors({
    origin: frontendUrl, // Use the FRONTEND_URL from the environment variables
    credentials: true, // Allow cookies to be sent
  });

  await app.listen(3000);
}
bootstrap();