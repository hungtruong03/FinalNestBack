import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  try {
    app.enableCors({
      origin: [ 'http://localhost:5173', 'https://hungtruong03.github.io/FinalReactFront', 'https://final-react-front-rho.vercel.app/' ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authentication, Access-control-allow-credentials, Access-control-allow-headers, Access-control-allow-methods, Access-control-allow-origin, User-Agent, Referer, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Cache-Control, Pragma',
    });
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.error('Error starting server:', error);
  }
}
bootstrap();
