import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";

const validateRequest =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    try {
      await schema.validate(body);

      return next();
    } catch (error) {
      return res.status(422).json({ error });
    }
  };

export { validateRequest };
