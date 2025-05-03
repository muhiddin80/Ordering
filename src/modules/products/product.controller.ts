import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { createProductDuo } from "./dtos/create-products";
import { updateProductDto } from "./dtos/update-product.dto";
import { productParamsDuo } from "./dtos/product.params";
import { GetAllProductsQueryDuo } from "./dtos/product.params.dtos";

@Controller("products")
export class productController{
    constructor(private readonly productService:ProductService){}

    @Get()
    async getAllProducts(@Query() query:GetAllProductsQueryDuo){
        return await this.productService.getAllProducts(query);
    }

    @Post()
    async createProduct(@Body() body:createProductDuo){
        return await this.productService.createProduct(body);
    }

    @Put(":id")
    async updateProduct(@Body() body:updateProductDto,@Param() param:productParamsDuo){
        return await this.productService.updateProduct(body,param?.id)
    }

    @Delete(":id")
    async deleteProduct(@Param() param:productParamsDuo){
        return await this.productService.deleteProduct(param?.id)
    }
}
