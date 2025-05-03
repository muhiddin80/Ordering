import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request,Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const request = ctx.getRequest<Request>()
        const response = ctx.getResponse<Response>()

        

        response.status(exception.getStatus()).send({
            message:exception.message,
            error:exception.name,
            statusCode:exception.getStatus(),
            reqUrl:request.url,
            occuredAt:new Date().toDateString(),
        });
    };
};