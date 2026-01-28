import type { Response } from "../../types/DTO/response";

export interface BaseService<T> {
  getAllPagination(params: {}): Promise<Response<T>>;
  getAllPaginationFilter(params: {}): Promise<Response<T>>;

  create(item: T): Promise<Response<T>>;
  update(id: string, item: T): Promise<Response<T>>;
  delete(id: Array<string>): Promise<Response<null>>;
}
