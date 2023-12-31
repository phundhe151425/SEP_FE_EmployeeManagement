import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";
import axios from 'axios';
import authHeader from "@/services/auth-header";

class RequestService {
    save(data) {
        return axios.post(BASE_URL + "/auth/request/create-request", data,{headers: authHeader()});
    }

    getData(page, size, search, status, departmentId,type, from, to) {
        return axios.get( BASE_URL+"/auth/request/get-list-request?page="+page
        +"&size="+size+"&search="+search +"&status="+ status +"&departmentId="+departmentId+"&type="+type+"&from="+from+"&to="+to,{headers: authHeader()});
    }

    changeStatus(id, data){
        return axios.post(BASE_URL +`/auth/request/update-status-request/${id}`, data,{headers: authHeader()});
    }

    updateRequest(id, data){
        return axios.post(BASE_URL +`/auth/request/update-request/${id}`, data,{headers: authHeader()});
    }

    getRequest(id) {
        return httpCommon.get(`/auth/request/get-request-by-id/${id}`,{headers: authHeader()});
    }

    getListRequestByUser(page, size, search, status,type,from, to) {
        return httpCommon.get("/auth/request/get-list-request-by-user-id?page="+page
        +"&size="+size+"&search="+search +"&status="+ status+"&type="+type+"&from="+from+"&to="+to,{headers: authHeader()});
    }

    getListRequestByUserAndStartDate(startDate, page, size) {
        return httpCommon.get("/auth/request/get-list-request-by-user-id-and-start-date?page="+page
        +"&size="+size+"&startDate="+startDate,{headers: authHeader()});
    }

    getRequestTypes(categoryId) {
        return axios.get( BASE_URL+"/auth/request-type/get-list-request-type-by-category-id?categoryId="+categoryId
        ,{headers: authHeader()});
    }

    getAllRequestType() {
        return axios.get( BASE_URL+"/auth/request-type/get-list-request-type"
        ,{headers: authHeader()});
    }


    getRequestCategories() {
        return axios.get( BASE_URL+"/auth/request-category/get-list-request-category",{headers: authHeader()});
    }

    processRequest(day, month,year){
        return httpCommon.get("/scheduled/processRequest?day=" + day +"&month=" + month + "&year=" + year, {headers: authHeader()});
    }

}

export default new RequestService();