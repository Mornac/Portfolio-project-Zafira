import 'dotenv/config';
import {ValidationPipe} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = process.env.API_PREFIX ?? 'api';
  app.setGlobalPrefix(globalPrefix);
  const config = new DocumentBuilder()
    .setTitle('Coucou Ingrid API')
    .setDescription('Documentation de l’API Zafira')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ignore les champs non déclarés dans les DTOs
      forbidNonWhitelisted: true, // rejette si des champs inconnus sont envoyés
      transform: true, // convertit les types (string → number, etc.)
    }),
  );

  const allowedOrigins =
    process.env.ALLOWED_ORIGIN?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) || [];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
