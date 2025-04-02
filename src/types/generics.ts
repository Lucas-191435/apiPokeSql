export type GetAllArgs<T> = {
  page?: number;
  pageSize?: number;
  query: string;
  orderBy?: string;
  direction?: string;
  id?: string;
};


export type TRows<T> = {
  rows: T[];
  count: number;
  pageSize?: number;
  page?: number;
};

export interface IError {
  message: string;
  statusCode: number;
  details?: any;
}

export type ResultVoidOrError = void | IError;

export type ServiceFn<Args, Result> = (args: Args) => Result;