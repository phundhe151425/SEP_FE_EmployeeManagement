import axios from "axios";
export const BASE_URL = 'http://localhost:2000/api'; // url backend
export const BE_URL = 'http://localhost:2000/';
export const FE_URL = 'http://localhost:2001/';

// export const BASE_URL = 'http://3.94.70.29:2000/api'; // url backend
// export const BE_URL = 'http://3.94.70.29:2000/';
// export const FE_URL = 'http://3.94.70.29:2001/';

export const jsonAPI = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-type": 'application/json'
    }
})
export const faceAPI = axios.create({
    baseURL: 'https://172.16.106.56:5001/'
})
export default axios.create({
    baseURL: BASE_URL,
    headers: {
        enctype: "multipart/form-data",
        "Content-type": 'application/octet-stream',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        processData: false,
    }
})

