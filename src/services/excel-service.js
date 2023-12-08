import axios from 'axios';
import { BASE_URL } from "@/http-common";
import authHeader from "@/services/auth-header";
class ExcelService {
    exportExcelUser(params) {
        axios.get(BASE_URL + `/auth/user/export_users`, {
            params,headers: authHeader(),
            responseType: 'blob',
        }).then((response) => {
            const url = URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute(
                'download',
                `Danh sách nhân viên -${new Date().toLocaleDateString()}.xlsx`
            )
            document.body.appendChild(link)
            link.click()
        }).catch((e) => {
            console.log(e);
            if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
        });
    }

    exportExcelReport(params) {
        axios.get(BASE_URL + `/auth/attendance/export_report`, {
            params,headers: authHeader(),
            responseType: 'blob',
        }).then((response) => {
            const url = URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute(
                'download',
                `Bảng Chấm Công-${new Date().toLocaleDateString()}.xls`
            )
            document.body.appendChild(link)
            link.click()
        })
    }


}

export default new ExcelService();