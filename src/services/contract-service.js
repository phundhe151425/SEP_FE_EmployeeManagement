import httpCommon from "@/http-common";
import axios from 'axios';
import { BASE_URL } from "@/http-common";
import authHeader from "@/services/auth-header";
import {authHeaderFormData} from "@/services/auth-header";
class ContractService {

    getCurrentContractByUserId(userId){
        return httpCommon.get("/contract/"+userId);
    }
    getAllContract() {
        return axios.get(BASE_URL + '/contract/get-all', {headers: authHeader()});
    }
    getContracts(page, size, search) {
        return axios.get(BASE_URL + '/contract/data1?pageNo='+page+"&pageSize="+size+"&search="+search, {headers: authHeader()});
    }

    getContract(id) {
        return axios.get(BASE_URL +`/auth/contract/${id}`, {headers: authHeader()});
    }

    save(data) {
        return axios.post(BASE_URL + "/contract/create", data, {headers: authHeaderFormData()});
    }

    updateContract(contractId, updatedContract) {
        return axios.put(BASE_URL + `/contract/update/${contractId}` ,updatedContract, {headers: authHeader()});
    }


    deleteContract(contractId) {
        const config = {
            headers: authHeader()
        };

        return axios.delete(BASE_URL + '/contract/delete/' + contractId, config);
    }

    getEmployee(){
        return  axios.get(BASE_URL + '/contract/employee-contact', {headers: authHeader()});
    }
}

export default new ContractService();