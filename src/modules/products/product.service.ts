import { BadRequestException, ConflictException, Injectable, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/database/db";
import { productModelTable } from "./model/product.model";
import { IProduct, IProductUpdate } from "./interface/product.interface";
import { FsHelper } from "src/helpers/fs.helper";

@Injectable()
export class ProductService implements OnModuleInit{
    constructor(private readonly pg:PostgresService,
            private readonly fs:FsHelper
     ){}

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

    async createProduct(payload:IProduct,image:Express.Multer.File[]){
        const foundedProduct = await this.pg.query("SELECT * FROM  products WHERE name = $1;",[payload.name]);
        let arr:string[]=[]
        if(foundedProduct.length!= 0){
            throw new ConflictException("This product is already exist!")
        };
        let productImage:string;
        if(image.length>0){
            for(let i of image){
                productImage = await this.fs.uploadFile(i)
                arr.push(productImage)
            }
        }

        const product = await this.pg.query("INSERT INTO products (name,price,category_id,file_url) VALUES ($1,$2,$3,$4) RETURNING *;",
        [payload.name,payload.price,payload.category_id,JSON.stringify(arr)])
        return {
            message:"Successfully created!",
            data:product
        }
    }

    async updateProduct(payload:IProductUpdate,id:number,image:Express.Multer.File[]){
        const foundedProduct = await this.pg.query("SELECT * FROM products WHERE id = $1",[id]);
        if(foundedProduct.length==0){
            throw new BadRequestException("This product does not exists!")
        };
        console.log(foundedProduct[0].file_url)
        let imagesUrl:string[]=[];
        if(foundedProduct[0].file_url){
            if(typeof foundedProduct[0].file_url == "string"){
                imagesUrl= JSON.parse(foundedProduct[0].file_url)
            }
            else{
                imagesUrl = foundedProduct[0].file_url
            }
        }
        if(image && image.length>0){
            for(let oldFileUrl of imagesUrl){
                await this.fs.deleteFile(oldFileUrl)
            }

            imagesUrl = []
            for(let i of image){
                const uploadedImage =  await this.fs.uploadFile(i);
                imagesUrl.push(uploadedImage)
            }
        }
        const product = await this.pg.query("UPDATE products SET name = $1,price = $2,file_url=$3 WHERE id = $4 RETURNING *;",
            [payload.name,payload.price,JSON.stringify(imagesUrl),id]);
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
        let imagesUrl:string[]=[]
        if(foundedProduct[0].file_url){
            if(typeof foundedProduct[0].file_url == "string"){
                imagesUrl= JSON.parse(foundedProduct[0].file_url)
            }
            else{
                imagesUrl = foundedProduct[0].file_url
            }
        }
        for(let oldFileUrl of imagesUrl){
            await this.fs.deleteFile(oldFileUrl)
        }
        const product = await this.pg.query("DELETE FROM products WHERE id = $1;",[id]);
        return {
            message:"Successfully deleted!"
        }
    }
}