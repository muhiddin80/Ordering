import { Body, Controller, Get, Param, Post,Delete } from "@nestjs/common";
import { OrderService } from "./order.service";
import { IOrder } from "./interfaces/order.interface";
import { orderParamsDuo } from "./dtos/order.params.dto";
import { orderBodyDuo } from "./dtos/order.body.duo";

@Controller("orders")
export class orderController{
    constructor(private readonly orderService:OrderService){}

    @Get()
    async getAllOrders(){
        return await this.orderService.getAllOrders()
    }

    @Post()
    async createOrders(@Body() body:orderBodyDuo){
        return await this.orderService.createOrder(body)
    }

    @Delete(":id")
    async deleteCategory(@Param() param:orderParamsDuo){
        return await this.orderService.deleteOrder(param?.id)
    }
}