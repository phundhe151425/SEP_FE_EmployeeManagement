import axios from 'axios';
import { BASE_URL } from "@/http-common";

import authHeader from "@/services/auth-header";
class PositionService {
    getAllPosition() {
        return axios.get(BASE_URL + '/position/get-all ', {headers: authHeader()});
    }
}

export default new PositionService();