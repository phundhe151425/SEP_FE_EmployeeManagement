import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';

class UserService {
    save(data) {
        return axios.post(BASE_URL + "/user/create", data);
    }
    getData(page, size, departId, search, status) {
        return httpCommon.get( "/user/data?page="+page+"&size="+size+"&departmentId="+departId+"&search="+search+"&status="+status );
    }


}

export default new UserService();