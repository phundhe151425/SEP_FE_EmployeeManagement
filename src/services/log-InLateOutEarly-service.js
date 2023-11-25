import httpCommon from "@/http-common";
import authHeader from "@/services/auth-header";
// import axios from "axios";
// import { BASE_URL } from "@/http-common";

class LogInLateOutEarly {

    getData(params) {
        return httpCommon.get("/logInLateOutEarly/data", {params,headers: authHeader()});
    }

}

export default new LogInLateOutEarly();