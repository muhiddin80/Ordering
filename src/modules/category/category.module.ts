import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { categoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { PostgresService } from "src/database/db";
import { LoggerMiddleware } from "src/middleware";
import { FsHelper } from "src/helpers/fs.helper";

@Module({
    controllers:[categoryController],
    providers:[CategoryService,PostgresService,FsHelper]
})
export class categoryModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(categoryController)
    }
}
