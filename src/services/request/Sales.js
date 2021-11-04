import { noAuthAPI } from "./AxiosDefault";

const salesAdd = (obj) => {
  return noAuthAPI.post("/processfield/add", obj);
};
const salesDelete = (obj) => {
  return noAuthAPI.post("/processfield/delete", obj);
};
const salesGet = (obj) => {
  return noAuthAPI.get("/processfield/get", { params: obj });
};
const salesList = (obj) => {
  return noAuthAPI.get("/processfield/list", { params: obj });
};

const SalesAPI = {
  salesAdd,
  salesDelete,
  salesGet,
  salesList,
};

export default SalesAPI;
