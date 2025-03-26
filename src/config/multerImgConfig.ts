import multer, { diskStorage, FileFilterCallback } from 'multer'
import { Request } from 'express'
import { randomBytes } from 'crypto'
import path from 'path'

const upload = multer({
    storage: multer.memoryStorage(), // Armazena o arquivo em memória
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    fileFilter: (req, file, callback) => {
      const allowedMimes = ['image/jpeg', 'image/png']
      if (allowedMimes.includes(file.mimetype)) callback(null, true)
      else callback(new Error('Invalid file type.'))
    }
  })
  
  export default upload