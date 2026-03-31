import multer, { diskStorage } from 'multer'
import { randomBytes } from 'crypto'
import path from 'path'

const multerConfig = {
    storage: diskStorage({
        destination: (req: any, file: any, callback: any) => {
            const fileName = file.fieldname
            console.log(fileName);
            let uploadPath

            switch (fileName) {
                case 'avatarProfile':
                    uploadPath = path.join(__dirname, '../tmp/avatarProfile')
                    break
                case 'eventoImage':
                    uploadPath = path.join(__dirname, '../tmp/bannerProfile')
                    break
                default:
                    uploadPath = path.join(__dirname, '../tmp/imgs')
            }

            callback(null, uploadPath)
        },

        filename: (req: any, file: any, callback: any) => {
            randomBytes(16, (err, hash) => {
                if (err) return callback(err, file.filename)

                const sanitizedFileName = file.originalname
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')

                const finalFileName = `${hash.toString('hex')}-${sanitizedFileName}`
                callback(null, finalFileName)
            })
        },
    }),

    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },

    fileFilter: (req: any, file: any, callback: any) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png']

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(new Error('Invalid mime type.'))
        }
    }
}

export default multerConfig