import httpCommon from "@/http-common";


class AttendanceService {

    getForCalendar(params){
        console.log(params)
        return httpCommon.get("/attendance/getAttendanceByMonthAndYear", {params});
    }

    getForReport(params) {
        return httpCommon.get("/attendance/allByMonthAndYearAndDepartment", {params})
    }
}

export default new AttendanceService();