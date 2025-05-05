import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/database/db";
import { orderModelTable } from "./model/order.model";
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
        const order = await this.pg.query(`
            SELECT 
              o.id, 
              o.user_id, 
              json_agg(
                json_build_object(
                  'id', p.id,
                  'name', p.name,
                  'price', p.price
                )
              ) AS products
            FROM orders o
            LEFT JOIN products p ON o.product = p.name
            GROUP BY o.id, o.user_id;
          `, []);
          
        return {
            message:"Success!",
            count:order.length,
            data:order
        }
    }

    async createOrder(payload:IOrder):Promise<object>{
        let foundedProduct = await this.pg.query("SELECT FROM products WHERE name = $1;",[payload.product]);
        if(foundedProduct.length == 0){
            throw new BadRequestException("This product does not exists!")
        }
        await this.pg.query("INSERT INTO orders (user_id,product) VALUES ($1,$2)",[payload.user_id,payload.product]);
        return {
            message:"Successfully created!"
        }
    }

    async deleteOrder(id:number):Promise<Object>{
        const foundedOrder = await this.pg.query("SELECT * FROM orders WHERE id=$1",[id]);
        if(foundedOrder.length==0){
            throw new BadRequestException("This order does not exists!")
        };
        await this.pg.query("DELETE FROM orders WHERE id = $1",[id])
        return {
            message:"Successfully deleted!",
        }
    }
}