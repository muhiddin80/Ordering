import { Module } from "@nestjs/common";
import { orderController } from "./order.controller";
import { OrderService } from "./order.service";
import { PostgresService } from "src/database/db";

@Module({
    controllers:[orderController],
    providers:[OrderService,PostgresService]
})

export class OrderModel {}