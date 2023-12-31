import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';
import authHeader from "@/services/auth-header";

class TimeKeepingService {
    getData(page, size, departmentId,search, from, to) {
        return axios.get( BASE_URL+"/auth/attendance/get-list-attendance?page="+page
        +"&size="+size+"&departmentId="+departmentId+"&searchInput="+search+"&from="+from+"&to="+to,{headers: authHeader()});
    }

    getListAttendanceByUser(page, size, from, to) {
        return httpCommon.get("/auth/attendance/get-list-attendance-by-user-id?page="+page
        +"&size="+size+"&from="+from+"&to="+to,{headers: authHeader()});
    }

}

export default new TimeKeepingService();