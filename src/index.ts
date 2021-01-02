// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/better-typescript-lib/lib.es6.d.ts" />

import axios, { AxiosInstance } from "axios";
import { Response, DeviceList } from "./interface";

/**
 * The REST API client class.
 *
 * This class manipulates SwitchBot devices and infrared appliances using RESTful API.
 */
export class RestClient {
  /**
   * Axios instance dedicated to SwitchBot API.
   */
  private readonly axios: AxiosInstance;

  /**
   * Create a new REST API client instance.
   * @param accessToken Access token issued by Wonderlabs.
   */
  constructor(accessToken: string) {
    this.axios = axios.create({
      baseURL: "https://api.switch-bot.com",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Get a list of devices.
   * @return List of decices managed by your SwitchBot account.
   * @throws Will throw an error if the request does not successfully recieve a list.
   */
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

  /**
   * Wrapper for `axios.get()`.
   * @param url
   * @typeParam T Type of the returned response data.
   */
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
