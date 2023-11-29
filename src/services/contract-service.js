import httpCommon from "@/http-common";
import axios from "axios";
import { BASE_URL } from "@/http-common";
import authHeader from "@/services/auth-header";
import { authHeaderFormData } from "@/services/auth-header";

class ContractService {
  getCurrentContractByUserId(userId) {
    return httpCommon.get("/auth/contract/" + userId,{ headers: authHeader()});
  }
  getAllContract() {
    return axios.get(BASE_URL + "/auth/contract/get-all", { headers: authHeader(),});
  }
  getContracts(page, size, search, deptId) {
    return axios.get(
      BASE_URL +
        "/auth/contract/data1?pageNo=" +
        page +
        "&pageSize=" +
        size +
        "&search=" +
        search +
        "&deptId=" +
        deptId,
      { headers: authHeader() }
    );
  }

  getContract(id) {
    return axios.get(BASE_URL + `/auth/contract/${id}`, {
      headers: authHeader(),
    });
  }

  async getContractByID(id) {
    return await axios.get(BASE_URL + `/auth/contract/detail/${id}`, {
      headers: authHeader(),
    });
  }

  async save(dataRequest, file) {
    console.log("ok da chay api");
    console.log(dataRequest);
    console.log(file);
    const json = JSON.stringify(dataRequest);
    const blob = new Blob([json], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("createContractRequest", blob);
    formData.append("contractFile", file);

    console.log("123456");
    return await axios.post(BASE_URL + "/auth/contract/create", formData, {
      headers: authHeaderFormData(),
    });
  }

  async updateContract(contractId, dataRequest, file) {
    console.log("ok da chay api");
    console.log(dataRequest);
    console.log(file);
    console.log(contractId);
    const json = JSON.stringify(dataRequest);
    const blob = new Blob([json], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("updateContractRequest", blob);
    formData.append("contractFile", file);

    return await axios.put(
      BASE_URL + `/auth/contract/update/${contractId}`,
      formData,
      {
        headers: authHeaderFormData(),
      }
    );
  }

  deleteContract(contractId) {
    const config = {
      headers: authHeader(),
    };

    return axios.delete(
      BASE_URL + "/auth/contract/delete/" + contractId,
      config
    );
  }

  getEmployee(deptIdAdd) {
    return axios.get(
      BASE_URL + "/auth/contract/employee-contact?deptId=" + deptIdAdd,
      {
        headers: authHeader(),
      }
    );
  }
}

export default new ContractService();
