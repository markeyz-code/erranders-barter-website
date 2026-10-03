import { G as GATEWAY_ENDPOINT } from "./axios.config-ClPwm9qs.js";
const itemsApi = {
  list: (params) => GATEWAY_ENDPOINT.get("/items", { params }),
  getById: (id) => GATEWAY_ENDPOINT.get(`/items/${id}`),
  create: (data) => GATEWAY_ENDPOINT.post("/items", data)
};
export {
  itemsApi as i
};
//# sourceMappingURL=items-6fAIzkhf.js.map
