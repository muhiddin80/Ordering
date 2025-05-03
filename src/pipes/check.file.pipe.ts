import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CheckFileSizePipe implements PipeTransform {
    limit:number
    constructor(limit:number){
        this.limit=limit;
    };
    transform(value: any, metadata: ArgumentMetadata) {
        if(value.size>this.limit)
            throw new BadRequestException(
            "Bu fayl juda katta"
        )
    };
};