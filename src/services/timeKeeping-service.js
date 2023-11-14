import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';
import authHeader from "@/services/auth-header";

class TimeKeepingService {
    save(data) {
        return axios.post(BASE_URL + "/auth/request/create-request", data,{headers: authHeader()});
    }

    getData(page, size, departmentId, from, to) {
        return axios.get( BASE_URL+"/attendance/get-list-attendance?page="+page
        +"&size="+size+"&departmentId="+departmentId+"&from="+from+"&to="+to,{headers: authHeader()});
    }

    getListAttendanceByUser(page, size, from, to) {
        return httpCommon.get("/attendance/get-list-attendance-by-user-id?page="+page
        +"&size="+size+"&from="+from+"&to="+to,{headers: authHeader()});
    }

    

    changeStatus(id, data){
        return axios.post(BASE_URL +`/auth/request/update-status-request/${id}`, data,{headers: authHeader()});
    }

    getRequest(id) {
        return httpCommon.get(`/auth/request/get-request-by-id/${id}`,{headers: authHeader()});
    }

   

    getRequestTypes(categoryId) {
        return axios.get( BASE_URL+"/auth/request-type/get-list-request-type-by-category-id?categoryId="+categoryId
        ,{headers: authHeader()});
    }

    getRequestCategories() {
        return axios.get( BASE_URL+"/auth/request-category/get-list-request-category",{headers: authHeader()});
    }


    

    updateHoliday(id, data) {
        return axios.put(BASE_URL + `/auth/holiday/update-holiday/${id}`,data,{headers: authHeader()});
    }
    deleteHoliday(id){
        return httpCommon.delete(`/auth/holiday/delete-holiday/${id}`,{headers: authHeader()});
    }

    getYears(){
        return httpCommon.get( "/auth/holiday/get-holidays/get-years", {headers: authHeader()});
    }

}

export default new TimeKeepingService();