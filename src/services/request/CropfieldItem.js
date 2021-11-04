import { noAuthAPI } from "./AxiosDefault";

const cropfielditemAdd = (obj) => {
  return noAuthAPI.post("/cropfielditem/add", obj);
};
const cropfielditemEdit = (obj) => {
  return noAuthAPI.post("/cropfielditem/edit", obj);
};
const cropfielditemDelete = (obj) => {
  return noAuthAPI.post("/cropfielditem/delete", obj);
};
const cropfielditemGet = (obj) => {
  return noAuthAPI.get("/cropfielditem/get", { params: obj });
};
const cropfielditemList = (obj) => {
  return noAuthAPI.get("/cropfielditem/list", { params: obj });
};
const cropfielditemSearch = (obj) => {
  return noAuthAPI.get("/cropfielditem/search", { params: obj });
};

const CropfieldItemAPI = {
  cropfielditemAdd,
  cropfielditemEdit,
  cropfielditemDelete,
  cropfielditemGet,
  cropfielditemList,
  cropfielditemSearch,
};

export default CropfieldItemAPI;
