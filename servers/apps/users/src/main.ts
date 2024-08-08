import { NestFactory } from "@nestjs/core";
import { UsersModule } from "./users.module";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);
  app.enableCors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  console.log(__dirname);
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "servers/email-templates"));
  app.setViewEngine("ejs");

  await app.listen(4001);
}
bootstrap();
