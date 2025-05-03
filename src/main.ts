import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middleware';
import { HttpExceptionFilter } from './filter';
import { BadRequestException, ForbiddenException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted:true,
      whitelist:true,
      exceptionFactory(errors) {
        let errorMsg = '';
        errors.forEach((err)=>{
          errorMsg += `${Object.values(err.constraints as any).join(",")}, `;
        });
        throw new BadRequestException(errorMsg);
      },
    })
  );

  const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000;
  await app.listen(port,()=>{
    console.log(`The server is running on port ${port}`)
  });
}
bootstrap();
