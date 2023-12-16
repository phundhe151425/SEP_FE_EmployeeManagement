import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';
import authHeader, {authHeaderFormData} from "@/services/auth-header";
class UserService {
    saveUser(data) {
        let dataForm = new FormData(data)
        return httpCommon.post("/auth/user/create", dataForm,{headers: authHeaderFormData()});
    }
    getAll() {
        return httpCommon.get( "/auth/user/getAll", {headers: authHeader()});
    }
    getData(page, size, departId, search, status) {
        return httpCommon.get( "/auth/user/data?page="+page+"&size="+size+"&departmentId="+departId+"&search="+search+"&status="+status, {headers: authHeader()});
    }
    profile(id){
        return httpCommon.get("/auth/user/profile/"+ id,{headers: authHeader()});
    }

    getProfile(id) {
        return httpCommon.get(`/auth/user/profile/${id}`,{headers: authHeader()});
    }

    updateProfile(id, data) {
        return axios.patch(BASE_URL + `/auth/user/profile/${id}`,data,{headers: authHeader()});
    }

    forgotPass(data){
        return axios.post(BASE_URL + `/forgot-password`, data);
    }

    changePass(data){
        return axios.put(BASE_URL + `/auth/change-password`, data, {headers: authHeader()});
    }

    changeStatus(id){
        return httpCommon.get("/auth/user/block/"+ id,{headers: authHeader()});
    }

    updateUser(id,data) {
        console.log(12, data);
        let dataForm = new FormData(data)
        console.log(13, dataForm);
        return httpCommon.put("/auth/user/update/"+id, dataForm,{headers: authHeaderFormData()});
    }
}

export default new UserService();