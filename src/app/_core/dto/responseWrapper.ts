



export interface ResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}
