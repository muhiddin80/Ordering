import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/database/db";
import { CategoryTableModel } from "./models";
import { ICategory } from "./interface/category.interface";
import { error } from "console";
import { FsHelper } from "src/helpers/fs.helper";


@Injectable()
export class CategoryService implements OnModuleInit{
    constructor(private readonly pg:PostgresService,
            private readonly fs:FsHelper
    ){}
    
    async onModuleInit() {
        try {
            await this.pg.query(CategoryTableModel,[])
            console.log("Category table yaratildi!");
        } catch (error) {
            console.log("Category table yaratishda xatolik!")
        }
    }

    async getAllCategories(query):Promise<object>{
        let sortField = query.sortField || "p.name";
        let sortOrder = query.sortOrder || "asc";
        let limit = +query.limit||10;
        let offset = query.limit*(query.page-1)||0;
        const result = await this.pg.query(`SELECT 
            p.id AS ca_id,
            p.name AS ca_name ,
            json_agg(
              json_build_object(
                'id', c.id,
                'name', c.name,
                'products', (
                  SELECT json_agg(
                           json_build_object(
                             'id', pr.id,
                             'name', pr.name,
                             'price',pr.price
                           )
                         )
                  FROM products pr
                  WHERE pr.category_id = c.id
                )
              )
            ) AS subcategories
          FROM categories p
          LEFT JOIN categories c ON c.category_id = p.id
          WHERE p.category_id IS NULL
          GROUP BY p.id, p.name 
          ORDER BY ${sortField} ${sortOrder} 
          LIMIT $1 OFFSET $2;
          `,[limit,offset])
        return {
            message:"success",
            count:result.length,
            data:result
        }
    }
    async createCategory(payload:ICategory,image:Express.Multer.File){
        const foundedCategory = await this.pg.query("SELECT * FROM categories WHERE name = $1",[payload.name]);
        if(!(foundedCategory.length===0)){
            throw new BadRequestException("This category already exists!")
        };
        let fileUrl = await this.fs.uploadFile(image);
        const category = await this.pg.query("INSERT INTO categories (name,category_id) VALUES ($1,$2)",
        [payload.name,payload.category_id])    
        return {
            message:'success',
            data:category
        }
    }

    async deleteCategory(id:number){
        const foundedCategory = await this.pg.query("SELECT * FROM categories WHERE id = $1",[id]);
        if(foundedCategory.length==0){
            throw new BadRequestException("This category does not exists!")
        };
        const category = await this.pg.query("DELETE FROM categories WHERE id=$1 RETURNING *",[id])

        return {
            message:"success",
            data:category,
        }
    }

    async updateCategory(id:number,payload:{name:string}){
        const foundedCategory = await this.pg.query("SELECT * FROM categories WHERE id = $1",[id]);
        console.log(foundedCategory)
        if(foundedCategory.length===0){
            throw new BadRequestException("This category does not exists!")
        };
        const category = await this.pg.query("UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",[payload.name,id])
        return {
            message:"Successfully updated!",
            data:category
        }
    }
    

} 