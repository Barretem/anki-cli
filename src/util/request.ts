/**
 * 请求封装
 */
import axios, { AxiosInstance } from "axios";
import { DEFAULT_ANKI_SERVICE_URL} from "./constant";


// 创建axios实例
const request = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: DEFAULT_ANKI_SERVICE_URL,
    timeout: 5000,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 在这里可以对请求进行配置，例如添加请求头、修改请求参数等
      return config;
    },
    (error) => {
      // 请求错误处理
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      // 在这里可以对响应进行处理，例如提取响应数据、处理错误等
      return response.data;
    },
    (error) => {
      // 响应错误处理
      return Promise.reject(error);
    }
  );

  return instance;
}

const requestInstance = request();

export default requestInstance;