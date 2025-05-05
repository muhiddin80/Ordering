import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/database/db";
import { userModelTable } from "./models/user.model";
import { IUser, ILoginUser } from "./interface/user.interface";

@Injectable()
export class UserService implements OnModuleInit {
    constructor(private readonly pg: PostgresService) {}

    async onModuleInit() {
        try {
            await this.pg.query(userModelTable, []);
            console.log("User table yaratildi");
        } catch (error) {
            console.log("User table yaratishda xatolik!");
        }
    }

    async getAllUsers() {
        const users = await this.pg.query("SELECT * FROM users;", []);
        return {
            message: "success",
            count: users.length,
            data: users
        };
    }

    async getUserOrders(id:number){
        const userOrder = await this.pg.query(`SELECT 
                u.id AS customer_id,
                u.name AS customer_name,
                json_agg(
                    json_build_object(
                        'id', o.id,
                        'products', (
                            SELECT json_agg(
                                json_build_object(
                                    'id', pr.id,
                                    'name', pr.name,
                                    'price', pr.price
                                )
                            )
                            FROM products pr
                            WHERE pr.name = o.product
                        )
                    )
                ) AS orders
            FROM users u
            LEFT JOIN orders o ON o.user_id = u.id
            WHERE u.id = $1
            GROUP BY u.id, u.name;
        `, [id]);
        
        return { userOrder };
        
            return {
                message:"Success",
                data:userOrder
            }
    }

    async registerUser(payload: IUser) {
        const foundeduser = await this.pg.query("SELECT * FROM users WHERE email=$1",[payload.email]);
        if(foundeduser.length!=0){
            throw new BadRequestException("This user is already exists!")
        };
        const user = await this.pg.query(
            "INSERT INTO users (email, password,name) VALUES ($1, $2,$3) RETURNING *;",
            [payload.email, payload.password,payload.name]
        );
        return {
            message: "Successfully registered!",
            data: user
        };
    }

    async loginUser(payload: ILoginUser) {
        const foundeduser = await this.pg.query("SELECT * FROM users WHERE email=$1",[payload.email]);
        if(foundeduser.length==0){
            throw new BadRequestException("This user does not exists!")
        };
        const user = await this.pg.query(
            "SELECT * FROM users WHERE email = $1 AND password = $2;",
            [payload.email, payload.password]
        );
        return {
            message:"Successfully registered!",
            data: user
        };
    }

    async updateUser(payload: {name:string,password:string}, id: number) {
        const foundeduser = await this.pg.query("SELECT * FROM users WHERE id = $1",[id]);
        if(foundeduser.length==0){
            throw new BadRequestException("This user does not exists!")
        };
        const user = await this.pg.query(
            "UPDATE users SET name=$1, password = $2 WHERE id = $3 RETURNING *;",
            [payload.name, payload.password, id]
        );
        return {
            message: "Successfully updated!",
            data: user
        };
    }

    async deleteUser(id: number) {
        const foundeduser = await this.pg.query("SELECT * FROM users WHERE id = $1",[id]);
        if(foundeduser.length==0){
            throw new BadRequestException("This user does not exists!")
        };
        const user = await this.pg.query(
            "DELETE FROM users WHERE id = $1;",
            [id]
        );
        return {
            message: "Successfully deleted!"
        };
    }
}
