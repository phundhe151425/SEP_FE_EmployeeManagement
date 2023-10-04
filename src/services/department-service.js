import axios from 'axios';
import { BASE_URL } from "@/http-common";


class DepartmentService {
    getAllDepartment() {
        return axios.get(BASE_URL + '/department/get-list');
    }
}

export default new DepartmentService();