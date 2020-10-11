import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// eslint-disable-next-line
export interface RequestConfig extends AxiosRequestConfig {}

// eslint-disable-next-line
export interface Response<T = any> extends AxiosResponse<T> {

}

export class Request {
  constructor (private request = axios) {}

  public get<T> (url: string, config: RequestConfig = {}): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config);
  }

  public static isRequestError (err: AxiosError): boolean {
    return !!(err.response && err.response?.status);
  }
}
