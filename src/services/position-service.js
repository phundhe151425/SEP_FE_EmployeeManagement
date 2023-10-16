import axios from 'axios';
import { BASE_URL } from "@/http-common";
import authHeader from "@/services/auth-header";
class PositionService {
    getAllPosition() {
        return axios.get(BASE_URL + '/position/get-all ', {headers: authHeader()});
    }
    getPositions(page, size, search) {
        return axios.get(BASE_URL + '/position/data?pageNo='+page+"&pageSize="+size+"&search="+search, {headers: authHeader()});
    }

    getRoles(page, size, search) {
        return axios.get(BASE_URL +"/role/data?page=" +page+"&size="+size+"&search="+search);
    }

    save(data) {
        return axios.post(BASE_URL + "/position/create", data);
    }

    getPosition(id) {
        return axios.get(BASE_URL +`/position/${id}`);
    }

    updatePosition(id, data) {
        return axios.put(BASE_URL + `/position/update/${id}`,data);
    }
    deletePosition(id){
        return axios.delete(BASE_URL +`/position/delete/${id}`);
    }
}

export default new PositionService();