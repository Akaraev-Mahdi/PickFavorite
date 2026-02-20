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

    deleteFile(imgName: string) {

        const staticPath = path.resolve(process.cwd(), 'static')
        const filePath = path.join(staticPath, imgName)

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Ошибка при удалении файла:', err)
                    return
                }
            })
        } else {
            console.log('Файл не найден по пути:', filePath)
        }
    }
}
