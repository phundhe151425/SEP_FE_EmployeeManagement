import axios from 'axios';
import { BASE_URL } from "@/http-common";
import authHeader from "@/services/auth-header";

class DepartmentService {
    getAllDepartment() {
        return axios.get(BASE_URL + '/department/get-list', {headers: authHeader()});
    }

    getDepartments(page, size, search) {
        return axios.get(BASE_URL + '/department/data?pageNo='+page+"&pageSize="+size+"&search="+search, {headers: authHeader()});
    }

    save(data) {
        return axios.post(BASE_URL + "/department/create", data, {headers: authHeader()});
    }

    getDepartment(id) {
        return axios.get(BASE_URL +`/department/${id}`, {headers: authHeader()});
    }

    updateDepartment(id, data) {
        return axios.put(BASE_URL + `/department/update/${id}`,data, {headers: authHeader()});
    }
    deleteDepartment(id){
        return axios.delete(BASE_URL +`/department/delete/${id}`, {headers: authHeader()});
    }
}

export default new DepartmentService();