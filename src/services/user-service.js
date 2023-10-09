import httpCommon from "@/http-common";
// import { BASE_URL } from "@/http-common";
// import axios from 'axios';
// import authHeader from "@/services/auth-header";

class UserService {
    saveUser(data) {
        console.log(12, data);
        let dataForm = new FormData(data)
        console.log(13, dataForm);
        return httpCommon.post("/user/create", dataForm);
    }
    getData(page, size, departId, search, status) {
        return httpCommon.get( "/user/data?page="+page+"&size="+size+"&departmentId="+departId+"&search="+search+"&status="+status );
    }
    profile(id){
        return httpCommon.get("/user/profile/"+ id);
    }
    changeStatus(id){
        return httpCommon.get("/user/block/"+ id);
    }
}

export default new UserService();