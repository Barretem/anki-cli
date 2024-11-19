/**
 * 获取 anki 版本号
 */
import request from "../util/request";

const getVersion = async () => {
  const res = await request.get("/version");
  return res;
}

export default getVersion;