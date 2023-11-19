import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';
import authHeader from "@/services/auth-header";

class WorkingTimeService {
    getData(page, size, search) {
        return axios.get( BASE_URL+"/auth/workingtime/data?pageNo="+page
        +"&pageSize="+size +"&search="+search,{headers: authHeader()});
    }

    updateWorkingTime(id, startTime, endTime){
        return axios.put(BASE_URL +`/auth/workingtime/${id}?startTime=`+startTime+`&endTime=`+endTime,{headers: authHeader()});
    }

    getWorkingTimeById(id) {
        return httpCommon.get(`/auth/workingtime/${id}`,{headers: authHeader()});
    }
}

export default new WorkingTimeService();