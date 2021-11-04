import { noAuthAPI } from "./AxiosDefault";

const tractorAdd = (obj) => {
  return noAuthAPI.post("/tractors/add", obj);
};
const tractorEdit = (obj) => {
  return noAuthAPI.post("/tractors/edit", obj);
};
const tractorDelete = (obj) => {
  return noAuthAPI.post("/tractors/delete", obj);
};
const tractorGet = (obj) => {
  return noAuthAPI.get("/tractors/get", { params: obj });
};
const tractorList = (obj) => {
  return noAuthAPI.get("/tractors/list", { params: obj });
};
const tractorSearch = (obj) => {
  return noAuthAPI.get("/tractors/search", { params: obj });
};

const TractorAPI = {
  tractorAdd,
  tractorEdit,
  tractorDelete,
  tractorGet,
  tractorList,
  tractorSearch,
};

export default TractorAPI;
