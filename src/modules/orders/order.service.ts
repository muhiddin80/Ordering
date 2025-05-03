import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/database/db";
import { orderModelTable } from "./model/order.model";
import { count } from "console";
import { IOrder } from "./interfaces/order.interface";

@Injectable()
export class OrderService implements OnModuleInit{
    constructor(private readonly pg:PostgresService){}
    async onModuleInit() {
        try {
            await this.pg.query(orderModelTable,[])
            console.log("Order Table yaratildi!")
        } catch (error) {
            console.log("Order Table yaratilishida xatolik!")
        }
    }

    async getAllOrders():Promise<object> {
        const order = await this.pg.query("SELECT * FROM orders;",[]);
        return {
            message:"Success!",
            count:order.length,
            data:order
        }
    }

    async createOrder(payload:IOrder):Promise<object>{
        const foundedOrder = await this.pg.query("SELECT * FROM orders WHERE user_id = []",[payload.user_id]);
        if(foundedOrder){
            throw new BadRequestException("This user already ordered!")
        };
        await this.pg.query("INSERT INTO orders (user_id) VALUES ($1)",[payload.user_id]);
        return {
            message:"Successfully created!"
        }
    }
}