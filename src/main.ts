import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  try {
    app.enableCors({
      origin: '*',
      methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ],
      credentials: false,
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Access-Control-Allow-Origin',
      ],
    });
    
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.error('Error starting server:', error);
  }
}
bootstrap();
