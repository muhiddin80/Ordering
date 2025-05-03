import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/database/db";
import { productModelTable } from "./model/product.model";
import { IProduct, IProductUpdate } from "./interface/product.interface";

@Injectable()
export class ProductService implements OnModuleInit{
    constructor(private readonly pg:PostgresService ){}

    async onModuleInit() {
        try {
            await this.pg.query(productModelTable,[])
            console.log("Product table yaratildi")
        } catch (error) {
            console.log("Product table yaratishda xatolik!")  
        }
    }

    async getAllProducts(query){
        const sortF = query.sortField || 'price';
        const sortO = query.sortOrder || 'asc';
        const limit = query.limit || 10;
        const page = query.page || 1;
        const offset = (page - 1) * limit;


        const products = await this.pg.query(`SELECT * FROM products ORDER BY ${sortF} ${sortO} LIMIT $1 OFFSET $2`,[limit,offset]);
        return {
            message:"success",
            count:products.length,
            data:products
        }
    }

    async createProduct(payload:IProduct){
        const product = await this.pg.query("INSERT INTO products (name,price,category_id) VALUES ($1,$2,$3) RETURNING *;",
        [payload.name,payload.price,payload.category_id])
        return {
            message:"Successfully created!",
            data:product
        }
    }

    async updateProduct(payload:IProductUpdate,id:number){
        const foundedProduct = await this.pg.query("SELECT * FROM products WHERE id = $1",[id]);
        if(foundedProduct.length==0){
            throw new BadRequestException("This product does not exists!")
        };
        const product = await this.pg.query("UPDATE products SET name = $1,price = $2 WHERE id = $3 RETURNING *;",
            [payload.name,payload.price,id]);
        return {
            message:"Successfully updated!",
            data:product
        }
    };

    async deleteProduct(id:number){
        const foundedProduct = await this.pg.query("SELECT * FROM products WHERE id = $1",[id]);
        if(foundedProduct.length==0){
            throw new BadRequestException("This product does not exists!")
        };
        const product = await this.pg.query("DELETE FROM products WHERE id = $1;",[id]);
        return {
            message:"Successfully deleted!"
        }
    }
}