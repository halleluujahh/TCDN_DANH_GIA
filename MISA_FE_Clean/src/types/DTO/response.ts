export interface Response<T> {
  statusCode: number;
  data?: T;
  listData: T[];
  isSuccess: boolean;
  isCreated: boolean;
  errors: Record<string, string>;
  traceId: string;
  message: string;
  timeStamp: Date;
  totalItem: number;
}
