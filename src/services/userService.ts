import { AxiosError, AxiosInstance } from "axios";
import apiService, {
  ApiError,
  ServerCreateResponse,
  ServerError,
  ServerUpdateResponse,
} from "./api";
import { requestConfig } from "./config";
import { api } from ".";

class userService extends apiService {
  constructor(api: AxiosInstance, path: string) {
    super(api, path);
  }

  public async update<T>(
    data: T
  ): Promise<AxiosError | ServerError | ServerUpdateResponse> {
    try {
      const response = await this.api.put(
        `${this.path}`,
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
    _id: string
  ): Promise<AxiosError | ApiError | ServerCreateResponse> {
    try {
      const response = await this.api.delete(
        `${this.path}`,
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

export default new userService(api, "/user");
