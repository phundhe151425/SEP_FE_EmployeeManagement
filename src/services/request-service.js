import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';
import authHeader from "@/services/auth-header";

class HolidayService {
    save(data) {
        return axios.post(BASE_URL + "/auth/request/create-request", data,{headers: authHeader()});
    }

    getData(page, size, search, status) {
        return axios.get( BASE_URL+"/auth/request/get-list-request?page="+page
        +"&size="+size+"&search="+search +"&status="+ status,{headers: authHeader()});
    }

    changeStatus(id, data){
        return axios.post(BASE_URL +`/auth/request/update-status-request/${id}`, data,{headers: authHeader()});
    }

    getRequest(id) {
        return httpCommon.get(`/auth/request/get-request-by-id/${id}`,{headers: authHeader()});
    }

    getRequestTypes(page, size) {
        return axios.get( BASE_URL+"/auth/request-type/get-list-request-type?page="+page
        +"&size="+size,{headers: authHeader()});
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

export default new HolidayService();