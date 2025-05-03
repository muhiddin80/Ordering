import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { categoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { PostgresService } from "src/database/db";
import { LoggerMiddleware } from "src/middleware";

@Module({
    controllers:[categoryController],
    providers:[CategoryService,PostgresService]
})
export class categoryModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(categoryController)
    }
}
