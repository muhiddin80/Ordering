import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { IUser, ILoginUser } from "./interface/user.interface";
import { LoginUserDuo, RegisteruserDuo } from "./dtos";
import { updateUserDuo } from "./dtos/update.user.dtos";
import { userParamsDuo } from "./dtos/user.params.dtos";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }

    @Get(":id")
    async getUserOrder(@Param() param:userParamsDuo){
        return await this.userService.getUserOrders(param?.id)
    }

    @Post("register")
    async registerUser(@Body() body: RegisteruserDuo) {
        return await this.userService.registerUser(body);
    }

    @Post("login")
    async loginUser(@Body() body: LoginUserDuo) {
        return await this.userService.loginUser(body);
    }

    @Put(":id")
    async updateUser(@Body() body: updateUserDuo, @Param() params:userParamsDuo ) {
        return await this.userService.updateUser(body, +params?.id);
    }

    @Delete(":id")
    async deleteUser(@Param() param: userParamsDuo) {
        return await this.userService.deleteUser(param?.id);
    }
}
