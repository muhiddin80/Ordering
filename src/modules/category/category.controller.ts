import { Body, Controller, Delete, Get, Param, ParseFilePipe, ParseIntPipe, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { createCategoryDto } from "./dtos";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { ParseIntCustomPipe } from "src/pipes";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetAllCategoryQueryDuo } from "./dtos/category.params";
import { CheckFileSizePipe } from "src/pipes/check.file.pipe";

@Controller("categories")
export class categoryController{
    constructor(private readonly categoryService:CategoryService){
    }

    @Get()
    async getAllCategories(@Query() query:GetAllCategoryQueryDuo){
        return await this.categoryService.getAllCategories(query);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createCategory(@Body() body:createCategoryDto,
    @UploadedFile(new CheckFileSizePipe(120000)) image:Express.Multer.File){
        return await this.categoryService.createCategory(body,image);
    }

    @Delete(":id")
    async deleteCategory(@Param('id',ParseIntCustomPipe) id:number){
        return await this.categoryService.deleteCategory(id);
    }

    @Put(":id")
    async updateCategory(@Param('id',ParseIntCustomPipe) id:number, @Body() body:UpdateCategoryDto){
        return await this.categoryService.updateCategory(id,body)
    }
}

