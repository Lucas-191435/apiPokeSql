import { NextFunction, Request } from "express";
import { verify } from "jsonwebtoken";

import prismaClient from "../database/index";

interface IJwtPayload {
  iat: number;
  exp: number;
  sub: string;
}

interface AuthenticatedRequest extends Request {
  user?: string;
}

const valideteUserToken = async (
  req: AuthenticatedRequest,
  res: any,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({
      message: "O token é necessário para a utilização desse recurso.",
    });

  const [, token] = authHeader.split(" ");

  try {
    const { sub: id } = verify(
      token,
      String(process.env.JWT_SECRET)
    ) as IJwtPayload;

    const user = await prismaClient.user.findFirst({ where: { id } });
    req.user = user?.id;

    return next();
  } catch {
    return res.status(401).json({ message: "O token é inválido." });
  }
};

export { IJwtPayload, valideteUserToken, AuthenticatedRequest };
