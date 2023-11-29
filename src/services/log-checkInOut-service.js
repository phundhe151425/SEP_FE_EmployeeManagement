import httpCommon from "@/http-common";
import authHeader from "@/services/auth-header";
// import axios from "axios";
// import { BASE_URL } from "@/http-common";

class LogCheckInOutService {

    getData(params) {
        return httpCommon.get("/auth/logCheckInOut/data", {params,headers: authHeader()});
    }

}

export default new LogCheckInOutService();