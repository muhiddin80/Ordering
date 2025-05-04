import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { categoryModule, ProductModule } from './modules';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filter';
import { UserModule } from './modules/users/user.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { OrderModel } from './modules/orders/order.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
  }),
  categoryModule,ProductModule,UserModule,OrderModel],
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
