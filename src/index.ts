// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/better-typescript-lib/lib.es6.d.ts" />

import axios, { AxiosInstance } from "axios";
import { Response, DeviceList } from "./interface";

export class RestClient {
  private readonly axios: AxiosInstance;

  constructor(accessToken: string) {
    this.axios = axios.create({
      baseURL: "https://api.switch-bot.com",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    });
  }

  async getDeviceList(): Promise<DeviceList> {
    const response = await this.requestGet<Response>("/v1.0/devices");
    if ("statusCode" in response) {
      if (response.statusCode === 100) {
        return response.body;
      } else {
        throw new Error(
          "Device internal error due to device states not synchronized with server"
        );
      }
    } else {
      throw new Error(
        "Http 401 Error. User permission is denied due to invalid token."
      );
    }
  }

  private async requestGet<T>(url: string): Promise<T> {
    try {
      const response = await this.axios.get<T>(url);
      return response.data;
    } catch (error) {
      if (error.response !== undefined) {
        throw new Error(
          `Something went wrong (HTTP status code: ${error.response.status})`
        );
      }
      throw error;
    }
  }
}
