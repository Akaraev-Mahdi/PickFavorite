import { Injectable } from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs';
import * as uuid from 'uuid'

@Injectable()
export class FilesService {
    createFile(img: any): string {
        const fileName = uuid.v4() + '.jpg';
        const filePath = path.resolve(__dirname, '..', '..', 'static')
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, {recursive: true})
        }
        fs.writeFileSync(path.join(filePath, fileName), img.buffer)
        return fileName;
    }
}
