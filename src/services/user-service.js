import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';
import authHeader from "@/services/auth-header";

class UserService {
    save(data) {
        return axios.post(BASE_URL + "/user/create", data,{headers: authHeader()});
    }
    getData(page, size, departId, search, status) {
        return httpCommon.get( "/user/data?page="+page+"&size="+size+"&departmentId="+departId+"&search="+search+"&status="+status );
    }

    getData1(data) {
        return httpCommon.get( "/user/data" , {data} );
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


}

export default new UserService();