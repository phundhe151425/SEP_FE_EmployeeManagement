import httpCommon from "@/http-common";
import axios from "axios";
import { BASE_URL } from "@/http-common";
class AttendanceService {

    getForCalendar(params){
        console.log(params)
        return httpCommon.get("/attendance/getAttendanceByMonthAndYear", {params});
    }

    getForReport(params) {
        return httpCommon.get("/attendance/allByMonthAndYearAndDepartment", {params})
    }

    updateAttendance(logEdit) {
        // return httpCommon.post( "/attendance/edit", logEdit);
        return axios.post(BASE_URL + "/attendance/edit", logEdit);
    }
}

export default new AttendanceService();