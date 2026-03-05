// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Função para tratar funções assíncronas em rotas Express.
 * Captura erros e envia respostas.
 * Diminuindo repetição de código em controladores.
*/
export const asyncHandler = (fn: AsyncFunction) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await fn(req, res, next);
            
            if (result !== undefined && !res.headersSent) {
                return res.status(200).json({
                    success: true,
                    data: result
                });
            }
        } catch (error: any) {
            // ✅ Log detalhado para debug
            console.error('=== AsyncHandler Error ===');
            console.error('Route:', req.method, req.originalUrl);
            console.error('Params:', req.params);
            console.error('Query:', req.query);
            console.error('Body:', req.body);
            console.error('Error:', error);
            console.error('Stack:', error.stack);
            console.error('========================');
            
            if (!res.headersSent) {
                // Para o usuário final
                const statusCode = error.statusCode || 500;
                const message = statusCode === 500 
                    ? 'Erro interno do servidor' 
                    : error.message;

                return res.status(statusCode).json({
                    success: false,
                    error: message,
                    // ✅ Em desenvolvimento, mostra mais detalhes
                    ...(process.env.NODE_ENV === 'development' && {
                        details: error.message,
                        stack: error.stack
                    })
                });
            }
        }
    };
};