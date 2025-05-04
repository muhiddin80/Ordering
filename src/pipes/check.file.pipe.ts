import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CheckFileSizePipe implements PipeTransform {
    limit:number
    constructor(limit:number){
        this.limit=limit;
    };
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        // console.log("chekc",value)
        if(value.size>this.limit)
            throw new BadRequestException(
            "Bu fayl juda katta"
        )
        return value;
    };
};