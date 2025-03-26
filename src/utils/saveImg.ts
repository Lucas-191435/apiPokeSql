import path from 'path'
import fs from 'fs/promises'

async function saveImages(files: Express.Multer.File[], userId: string): Promise<string[]> {
  if (!files || files.length === 0) return []

  const savedFileNames: string[] = []

  for (const file of files) {
    let uploadPath: string
    switch (file.fieldname) {
      case 'avatarProfile':
        uploadPath = path.join(__dirname, '../..', 'tmp', 'avatarProfile')
        break
      case 'eventoImage':
        uploadPath = path.join(__dirname, '../..', 'tmp', 'bannerProfile')
        break
      default:
        uploadPath = path.join(__dirname, '../..', 'tmp', 'imgs')
    }

    try {
      await fs.mkdir(uploadPath, { recursive: true })
      const fileName = `${Date.now()}-${file.originalname}`
      const fullPath = path.join(uploadPath, fileName)

      console.log('Salvando imagem em:', fullPath)
      await fs.writeFile(fullPath, file.buffer)

      savedFileNames.push(fileName)
    } catch (err) {
      console.error('Erro ao salvar a imagem:', err)
    }
  }

  return savedFileNames
}

export { saveImages }