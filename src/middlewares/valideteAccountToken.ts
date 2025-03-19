import { NextFunction, Request } from "express";
import { verify } from "jsonwebtoken";

import prismaClient from "../database/index";

interface IJwtPayload {
  iat: number;
  exp: number;
  sub: string;
}

const valideteAccountToken = async (
  req: Request,
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
      String(process.env.SECRET_KEY)
    ) as IJwtPayload;

    const user = await prismaClient.user.findFirst({ where: { id } });
    res.user = user?.id;

    return next();
  } catch {
    return res.status(401).json({ message: "O token é inválido." });
  }
};

export { IJwtPayload, valideteAccountToken };
