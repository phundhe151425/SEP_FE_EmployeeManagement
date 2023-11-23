import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';
import authHeader from "@/services/auth-header";

class TimeKeepingService {
    getData(page, size, departmentId, from, to) {
        return axios.get( BASE_URL+"/attendance/get-list-attendance?page="+page
        +"&size="+size+"&departmentId="+departmentId+"&from="+from+"&to="+to,{headers: authHeader()});
    }

    getListAttendanceByUser(page, size, from, to) {
        return httpCommon.get("/attendance/get-list-attendance-by-user-id?page="+page
        +"&size="+size+"&from="+from+"&to="+to,{headers: authHeader()});
    }

}

export default new TimeKeepingService();