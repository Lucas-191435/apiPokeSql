import path from 'path'
import fs from 'fs/promises'
import { Request } from 'express'

interface MulterRequest extends Request {
  file?: Express.Multer.File
}
async function saveImage(file: any, userId: string): Promise<string | null> {
    if (!file) return null
  
    // Define o diretório de destino com base no fieldname
    let uploadPath: string
    switch (file.fieldname) {
      case 'avatarProfile':
        uploadPath = path.join(__dirname, '../..', 'tmp', 'avatarProfile');  // Corrigido: saindo de 'src/'
        break;
      case 'eventoImage':
        uploadPath = path.join(__dirname, '../..',  'tmp', 'bannerProfile');  // Corrigido: saindo de 'src/'
        break;
      default:
        uploadPath = path.join(__dirname, '../..',  'tmp', 'imgs');  // Corrigido: saindo de 'src/'
    }
  
    try {
      // Garante que o diretório existe
      await fs.mkdir(uploadPath, { recursive: true })
  
      // Define o nome do arquivo
      const fileName = `${Date.now()}-${file.originalname}`
      const fullPath = path.join(uploadPath, fileName)
  
      // Debugging: Verifica se o caminho está correto
      console.log('Salvando imagem em:', fullPath)
  
      // Salva o arquivo do buffer para o disco
      await fs.writeFile(fullPath, file.buffer)
  
      return fileName
    } catch (err) {
      console.error('Erro ao salvar a imagem:', err)
      return null
    }
  }

export { saveImage }