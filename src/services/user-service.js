import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';
// import authHeader from "@/services/auth-header";

class UserService {
    saveUser(data) {
        let dataForm = new FormData(data)
        return httpCommon.post("/user/create", dataForm);
    }
    getData(page, size, departId, search, status) {
        return httpCommon.get( "/user/data?page="+page+"&size="+size+"&departmentId="+departId+"&search="+search+"&status="+status );
    }
    profile(id){
        return httpCommon.get("/user/profile/"+ id);
    }

    getProfile(id) {
        return httpCommon.get(`/user/profile/${id}`);
    }

    updateProfile(id, data) {
        return axios.patch(BASE_URL + `/user/profile/${id}`,data);
    }

    forgotPass(data){
        return axios.post(BASE_URL + `/forgot-password`, data);
    }

    changePass(data){
        return axios.post(BASE_URL + `/change-password`, data);
    }

    changeStatus(id){
        return httpCommon.get("/user/block/"+ id);
    }

    updateUser(id,data) {
        console.log(12, data);
        let dataForm = new FormData(data)
        console.log(13, dataForm);
        return httpCommon.put("/user/update/"+id, dataForm);
    }
}

export default new UserService();