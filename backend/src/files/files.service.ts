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

    deleteFile(imgName: string){
        fs.readdir('../../static', (err, files) => {
            if (err) throw err;

            const foundFile = files.find(file => file === imgName);

            if (foundFile) {
                const filePath = path.join('../../static', foundFile);
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                });
            } else {
                console.log('Файл не найден');
            }
        });
    }
}
