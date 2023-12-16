import httpCommon from "@/http-common";
import axios from "axios";
import { BASE_URL } from "@/http-common";
import authHeader from "@/services/auth-header";
class AttendanceService {

    getForCalendar(params){
        console.log(params)
        return httpCommon.get("/auth/attendance/getAttendanceByMonthAndYear", {params,headers: authHeader()});
    }

    getForReport(params) {
        return httpCommon.get("/auth/attendance/allByMonthAndYearAndDepartment", {params,headers: authHeader()})
    }

    updateAttendance(logEdit) {
        // return httpCommon.post( "/attendance/edit", logEdit);
        return axios.post(BASE_URL + "/auth/attendance/edit", logEdit, {headers: authHeader()});
    }

    startEditing(attendanceId, userId) {
        // return httpCommon.post( "/attendance/edit", logEdit);
        return axios.post(BASE_URL + "/auth/attendance/startEditing/"+attendanceId+"/"+userId,{headers: authHeader()});
    }

    finishEditing(attendanceId) {
        // return httpCommon.post( "/attendance/edit", logEdit);
        return axios.post(BASE_URL + "/auth/attendance/finishEditing/"+attendanceId, {headers: authHeader()});
    }
    processAttendance(day, month,year){
        return httpCommon.get("/scheduled/processAttendance?day=" + day +"&month=" + month + "&year=" + year, {headers: authHeader()});
    }

    getAttendanceByUserAndDate(data){
        return axios.post(BASE_URL + "/auth/attendance/get-attendance-by-user-and-date-log", data, {headers: authHeader()});
    }
}

export default new AttendanceService();