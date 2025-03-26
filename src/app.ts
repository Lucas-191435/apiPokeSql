import cors from 'cors'
import express, { json, Request, Response, urlencoded } from 'express'
import path, { join } from 'path'
import routes from './routes'

const app = express()
console.log('Diretório estático configurado para:', path.resolve(__dirname, '..', 'tmp'));

app.use(cors({
  origin: (process.env.WEB_URL as string).split(";"),
}))

app.use(json())
app.use(urlencoded({ extended: true }))

// app.use('/avatarProfile', express.static(join(__dirname, 'tmp', 'avatarProfile')))
app.use('/avatars', express.static(path.resolve(__dirname, '..', 'tmp', 'avatarProfile')));  // Corrigido: saindo de 'src/'


app.use('/', routes) 

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'PokeAPI',
    // version: process.env.npm_package_version,
    // env: process.env.ENVIRONMENT
  })
})


export default app
