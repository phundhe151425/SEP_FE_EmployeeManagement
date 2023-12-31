import axios from 'axios';
import { BASE_URL } from "@/http-common";
import authHeader from "@/services/auth-header";
class PositionService {
    getAllPosition() {
        return axios.get(BASE_URL + '/auth/position/get-all ', {headers: authHeader()});
    }
    getPositions(page, size, search) {
        return axios.get(BASE_URL + '/auth/position/data?pageNo='+page+"&pageSize="+size+"&search="+search, {headers: authHeader()});
    }

    getRoles(page, size, search) {
        return axios.get(BASE_URL +"/auth/role/data?page=" +page+"&size="+size+"&search="+search, {headers: authHeader()});
    }

    save(data) {
        return axios.post(BASE_URL + "/auth/position/create", data, {headers: authHeader()});
    }

    getPosition(id) {
        return axios.get(BASE_URL +`/auth/position/${id}`, {headers: authHeader()});
    }

    updatePosition(id, data) {
        return axios.put(BASE_URL + `/auth/position/update/${id}`,data, {headers: authHeader()});
    }
    deletePosition(id){
        return axios.delete(BASE_URL +`/auth/position/delete/${id}`, {headers: authHeader()});
    }
}

export default new PositionService();