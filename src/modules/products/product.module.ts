import { MiddlewareConsumer, Module, NestMiddleware, NestModule } from "@nestjs/common";
import { productController } from "./product.controller";
import { ProductService } from "./product.service";
import { PostgresService } from "src/database/db";
import { LoggerMiddleware } from "src/middleware";

@Module({
    controllers:[productController],
    providers:[ProductService,PostgresService]
})

export class ProductModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(productController)
    }
}