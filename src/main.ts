import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as compression from "compression";
import { join } from "path";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [process.env.CLIENT_URL],
      credentials: true,
    },
  });

  app.useStaticAssets(join(process.cwd(), "public"));
  app.use(cookieParser("secret"));
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
    })
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
