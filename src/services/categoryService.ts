import { AxiosError, AxiosInstance } from "axios";
import apiService, {
  ApiError,
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
} from "./api";
import { requestConfig } from "./config";
import { api } from ".";

class categoryService extends apiService {
  constructor(api: AxiosInstance, path: string) {
    super(api, path);
  }

  public async getAll() {
    try {
      const response = await this.api.get(this.path, requestConfig(false));
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  public async create<T>(
    data: T
  ): Promise<AxiosError | ServerError | ServerCreateResponse> {
    try {
      const response = await this.api.post(
        `${this.path}`,
        data,
        requestConfig(false)
      );
      return response.data as ServerCreateResponse;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ServerError;
      }
      throw error;
    }
  }

  public async update<T>(
    id: string,
    data: T
  ): Promise<AxiosError | ServerError | ServerUpdateResponse> {
    try {
      const response = await this.api.put(
        `${this.path}/${id}`,
        data,
        requestConfig(false)
      );
      return response.data as ServerUpdateResponse;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ServerError;
      }
      throw error;
    }
  }
  public async delete(
    id: string
  ): Promise<AxiosError | ApiError | ServerCreateResponse> {
    try {
      const response = await this.api.delete(
        `${this.path}/${id}`,
        requestConfig(false)
      );
      return response.data as ServerCreateResponse;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ApiError;
      }
      throw error;
    }
  }
}

export default new categoryService(api, "/categories");
