import cors from 'cors'
import express, { json, Request, Response, urlencoded } from 'express'
import path, { join } from 'path'
import routes from './routes'
import { requestLogger } from './middlewares/requestLogger'

const app = express()
console.log('Diretório estático configurado para:', path.resolve(__dirname, '..', 'tmp'));

app.use(cors({
  // origin: 'http://localhost:3000',
  origin: '*', // Permitir todas as origens (não recomendado para produção)
}));

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(requestLogger);
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

// Health check endpoint for Docker
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.ENVIRONMENT || 'development'
  })
})


export default app
