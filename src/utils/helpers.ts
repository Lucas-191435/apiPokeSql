/* eslint-disable no-prototype-builtins */
import {
    PrismaClientRustPanicError,
    PrismaClientValidationError,
    PrismaClientKnownRequestError,
    PrismaClientInitializationError,
    PrismaClientUnknownRequestError,
  } from "@prisma/client/runtime/library";
  import { StatusCodes } from "http-status-codes";
  import { sign } from "jsonwebtoken";
  import { unlink } from "fs";
  import { addMinutes, compareAsc } from "date-fns";
  import authConfig from "../config/authConfig";
  import { v4 as uuidv4  } from 'uuid';
  export const consoleColors = {
    Black: "\x1b[30m%s\x1b[0m",
    Red: "\x1b[31m%s\x1b[0m",
    Green: "\x1b[32m%s\x1b[0m",
    Yellow: "\x1b[33m%s\x1b[0m",
    Blue: "\x1b[34m%s\x1b[0m",
    Magenta: "\x1b[35m%s\x1b[0m",
    Cyan: "\x1b[36m%s\x1b[0m",
    White: "\x1b[37m%s\x1b[0m",
  };
  
  export function excludeFields<T, Key extends keyof T>(
    object: T,
    keys: Key[]
  ): Omit<T, Key> {
    return Object.fromEntries(
      Object.entries(object as any).filter(([key]) => !keys.includes(key as Key))
    ) as Omit<T, Key>;
  }
  
  export function selectFields<T, Key extends keyof T>(
    object: T,
    keys: Key[]
  ): Pick<T, Key> {
    return Object.fromEntries(
      Object.entries(object as any).filter(([key]) => keys.includes(key as Key))
    ) as Pick<T, Key>;
  }
  
  export const sequence = (length: number) =>
    Array.from({ length }, (_, index) => index);
  
  export const parseStringArrayToObject = (array: string[]) =>
    Array.isArray(array) ? array.map((item) => JSON.parse(item)) : undefined;
  
  /**
   * Transform an value received from yup with nullish condition.
   * Useful to transform an empty string value ("") to null for validation.
   * @param context any
   * @param value the value to be transformed
   * @returns the value or null
   */
  export const nullifyYupStringValue = (context: any, value: string) =>
    value ?? null;
  
  /**
   * Joins the received array, and return then separated by comma.
   * @param arr the array to join
   * @returns Each array element on a sigle string, separated by comma ',', with a 'e' on the last element.
   */
  export const toPrettify = (arr: string[]): string =>
arr.join(", ").replace(/,\s([a-zA-Z0-9-]+)$/gm, " e $1");
  
  export const getControllerErrorMessage = ({
    error,
    message,
  }: {
    error: unknown;
    message?: string;
  }): string => {
    const defaultErrorMessage =
      "Ocorreu um erro inesperado, tente novamente mais tarde.";
  
    const isPrismaErr = [
      PrismaClientRustPanicError,
      PrismaClientValidationError,
      PrismaClientKnownRequestError,
      PrismaClientInitializationError,
      PrismaClientUnknownRequestError,
    ].reduce((previousResult, prismaErrorInstance) => {
      if (previousResult) return true;
      return error instanceof prismaErrorInstance;
    }, false);
  
    /**
     * You can return custom errors here based on prisma code errors reference: @link https://www.prisma.io/docs/reference/api-reference/error-reference
     * The .code property can be accessed in a type-safe manner
     */
    if (isPrismaErr) {
      return message ?? defaultErrorMessage;
    }
  
    if (error instanceof Error)
      return error.message ?? message ?? defaultErrorMessage;
  
    return message ?? defaultErrorMessage;
  };
  
  export const getControllerErrorStatus = (error: unknown) => {
    if ((error as any).cause !== undefined) {
      const { cause }: any = error as Error;
  
      const status = !Number.isNaN(Number(cause as string))
        ? +(cause as string)
        : null;
  
      return status && Object.values(StatusCodes).includes(status)
        ? status
        : StatusCodes.INTERNAL_SERVER_ERROR;
    }
  
    return StatusCodes.INTERNAL_SERVER_ERROR;
  };

  export const generateCode = (): {
    authCode: string;
    expiresAt: Date;
  } => {
    const authCode = `${Math.floor(100000 + Math.random() * 900000).toString()}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    return {
      authCode,
      expiresAt,
    };
  }

  export const verifyAuthCode = ({authCode, expiresAt}: {authCode: string, expiresAt: Date}): boolean => {

    return !!(authCode && new Date() < expiresAt);
  }
  
  export const generateToken = (
    params: string | object | Buffer,
    options: {
      expiresIn?: string | number | undefined;
    } | void
  ) => ({
    token: sign(params, String(authConfig.secret), {
      expiresIn: options?.expiresIn ?? "5m", // 5 min. #ref: https://github.com/vercel/ms
      algorithm: "HS512",
    }),
    expiresAt: options?.expiresIn
      ? new Date(options?.expiresIn)
      : addMinutes(new Date(Date.now()), 5),
  });
  
  export const removeFile = (path: string) =>
    unlink(path, (unlinkError) => {
      // eslint-disable-next-line no-console
      console.log(
        unlinkError
          ? `🆘 \t file: removeFile.ts \t removeFile \t unlinkError: ${JSON.stringify(
              unlinkError,
              undefined,
              "\t"
            )}`
          : `File removed: ${path}`
      );
    });
  
  export const getFileUrl = (fileName: string, module: "avatars") =>
    `${process.env.APP_URL}/${module}/${fileName}`;
  
  export const isSafeNumber = (number: any) => !Number.isNaN(+number);
  
  const isValidDate = (date: any) =>
    new Date(date)?.toString() !== "Invalid Date" &&
    !Number.isNaN(new Date(date as string));
  
  export const normalizeString = (str: any): string =>
    typeof str === "string" &&
    !isValidDate(str) &&
    // Not email
    !/^\S+@\S+\.\S+$/.test(str) &&
    // Not a CEP
    !/^[0-9]{5}-[0-9]{3}$/.test(str)
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^A-Za-z\d\s]/g, "")
      : str;
  
  export function normalizeStringsFromObject<Result extends object>(
    obj: object
  ): Result {
    return Object.entries(obj).reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: (() => {
          if (v instanceof Object && !Array.isArray(v))
            return normalizeStringsFromObject(v);
          if (Array.isArray(v))
            return v.map((vItem) =>
              vItem instanceof Object && !Array.isArray(vItem)
                ? normalizeStringsFromObject(vItem)
                : normalizeString(v)
            );
          return normalizeString(v);
        })(),
      }),
      {}
    ) as Result;
  }
  
  export const isDatesEqual = ({
    firsDate,
    secondDate,
    ignoreTimeDifference,
  }: {
    firsDate: Date;
    secondDate: Date;
    ignoreTimeDifference?: boolean;
  }) => {
    if (ignoreTimeDifference) {
      firsDate.setHours(0, 0, 0, 0);
      secondDate.setHours(0, 0, 0, 0);
    }
  
    return compareAsc(firsDate, secondDate) === 0;
  };
  
  export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  
  export function compareObjects(
    objectA: Record<string, any>,
    objectB: Record<string, any>
  ): { isEqual: boolean; diferences: Record<string, any> } {
    const equal = JSON.stringify(objectA) === JSON.stringify(objectB);
  
    if (equal) {
      return { isEqual: true, diferences: {} };
    }
  
    const diferences: Record<string, any> = {};
  
    Object.keys(objectA).forEach((key) => {
      if (objectA.hasOwnProperty(key)) {
        if (objectA[key] !== objectB[key]) {
          diferences[key] = {
            valorObjetoA: objectA[key],
            valorObjetoB: objectB[key],
          };
        }
      }
    });
  
    Object.keys(objectB).forEach((key) => {
      if (objectB.hasOwnProperty(key) && !objectA.hasOwnProperty(key)) {
        diferences[key] = {
          valorObjetoA: undefined,
          valorObjetoB: objectB[key],
        };
      }
    });
  
    return { isEqual: false, diferences };
  }
  