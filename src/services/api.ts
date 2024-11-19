/**
 * 请求 anki 服务
 */
import request from "../util/request";
/**
 * 获取 anki 版本号
 */
export const getVersion = async () => {
  const res = await request.get("/version");
  return res;
}
