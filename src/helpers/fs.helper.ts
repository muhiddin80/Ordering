import { BadRequestException, Injectable } from "@nestjs/common";
import * as path from "node:path";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises"

@Injectable()
export class FsHelper {
    async uploadFile(file:Express.Multer.File){
        const fileHolder = path.join(process.cwd(),"uploads")
        // console.log("hello",file)

        if(!fs.existsSync(fileHolder)){
            fs.mkdirSync(fileHolder,{recursive:true})
        };

        let fileName =  `${Date.now()}-file.${file.originalname.split(".")[1]}`

        await fsPromises.writeFile(path.join(fileHolder,fileName),file.buffer);

        return {
            message:"success",
            fileUrl:path.join(fileHolder,fileName)
        }
    };

    async deleteFile(name:string){
        const fileHolder = path.join(process.cwd(),"uploads");

        await fsPromises.unlink(path.join(fileHolder,name));
        return {
            message:"success"
        }
    }
}