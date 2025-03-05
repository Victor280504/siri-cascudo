import { AxiosError, AxiosInstance } from "axios";
import apiService, {
  ApiError,
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
} from "./api";
import { requestConfig } from "./config";
import { api } from ".";

class saleService extends apiService {
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
      const config = requestConfig(false);
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "application/json";
      const response = await this.api.post(`${this.path}`, data, config);
      return response.data as ServerCreateResponse;
    } catch (error) {
      if (error instanceof AxiosError && error.message === "Network Error") {
        return {
          error: "Network Error",
          message: "Network Error",
        } as ServerError;
      }
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ServerError;
      }
      throw error;
    }
  }

  public async getById<T>(id: string): Promise<T> {
    try {
      const response = await this.api.get(
        `${this.path}/${id}`,
        requestConfig(false)
      );

      return response.data as T;
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  public async getReport<T>(): Promise<T> {
    try {
      const response = await this.api.get(
        `${this.path}/report`,
        requestConfig(false)
      );

      return response.data as T;
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  public async getAllByUserId<T>(id: string): Promise<T> {
    try {
      const response = await this.api.get(
        `${this.path}/user/${id}`,
        requestConfig(false)
      );

      return response.data as T;
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  public async getByIdWithDetails<T>(id: string): Promise<T> {
    try {
      const response = await this.api.get(
        `${this.path}/detail/${id}`,
        requestConfig(false)
      );

      return response.data as T;
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  public async update<T>(
    id: string,
    data: T
  ): Promise<AxiosError | ServerError | ServerUpdateResponse> {
    try {
      const config = requestConfig(false);
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "application/json";
      const response = await this.api.put(`${this.path}/${id}`, data, config);
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

export default new saleService(api, "/sales");
