import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isNumberString } from "class-validator";

@Injectable()
export class ParseIntCustomPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log(metadata)
        if(isNumberString(value)) return parseInt(value,10)
        else    
            throw new BadRequestException(
        `Berilgan qiymat: ${value}. Son bo'lishi kk`,
        );
    }
}