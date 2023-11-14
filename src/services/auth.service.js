import axios from 'axios';
// import httpCommon from "@/http-common";
import { BASE_URL } from "@/http-common";


class AuthService {
    login(user) {
        return axios
            .post(BASE_URL + '/login', {
                username: user.username,
                password: user.password,
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                   
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }



}

export default new AuthService();