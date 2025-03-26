import multer, { diskStorage, FileFilterCallback } from 'multer'
import path from 'path'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, callback) => {
    //Isso impede alguém de renomear um arquivo .exe para .jpg e tentar enganar o sistema.
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    
    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      callback(null, true)
    } else {
      callback(new Error('Invalid file type.'))
    }
  }
})
  
  export default upload