import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';


class HolidayService {
    save(data) {
        return axios.post(BASE_URL + "/holiday/create-holiday", data);
    }
    getData(page, size, search, year) {
        return httpCommon.get( "/holiday/get-all-holiday?page="+page+"&size="+size+"&search="+search +"&year="+year);
    }

    getHoliday(id) {
        return httpCommon.get(`/holiday/holiday-details/${id}`);
    }

    updateHoliday(id, data) {
        return axios.put(BASE_URL + `/holiday/update-holiday/${id}`,data);
    }
    deleteHoliday(id){
        return httpCommon.delete(`/holiday/delete-holiday/${id}`);
    }

    getYears(){
        return httpCommon.get( "/holiday/get-holidays/get-years");
    }

}

export default new HolidayService();