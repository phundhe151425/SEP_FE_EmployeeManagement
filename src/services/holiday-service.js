import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';
import authHeader from "@/services/auth-header";

class HolidayService {
    save(data) {
        return axios.post(BASE_URL + "/auth/holiday/create-holiday", data,{headers: authHeader()});
    }
    getData(page, size, search, year) {
        return axios.get( BASE_URL+"/auth/holiday/get-all-holiday?page="+page
        +"&size="+size+"&search="+search +"&year="+year,{headers: authHeader()});
    }

    getHoliday(id) {
        return httpCommon.get(`/auth/holiday/holiday-details/${id}`,{headers: authHeader()});
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