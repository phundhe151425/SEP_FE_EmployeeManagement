import axios from 'axios';
import { BASE_URL } from "@/http-common";

class ExcelService {
    exportExcelUser(params) {
        axios.get(BASE_URL + `/user/export_users`, {
            params,
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
        })
    }


}

export default new ExcelService();