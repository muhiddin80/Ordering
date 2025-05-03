import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { categoryModule, ProductModule } from './modules';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filter';
import { UserModule } from './modules/users/user.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
  }),
  categoryModule,ProductModule,UserModule],
  providers:[
    {
      provide:APP_FILTER,
      useClass:HttpExceptionFilter
    },
    {
      provide:APP_INTERCEPTOR,
      useClass:LoggingInterceptor
    }
  ]
})
export class AppModule {}
