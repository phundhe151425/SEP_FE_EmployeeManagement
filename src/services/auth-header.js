export default function authHeader() {
    // let user = JSON.parse(localStorage.getItem('user'));
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.token) {
        console.log(user)
        return {Authorization: 'Bearer ' + user.token};
    } else {
        return { 
        };
    }
}

export function authHeaderFormData() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.token) {
        return {
            Authorization: "Bearer " + user.jwtToken,
            'Content-Type': 'multipart/form-data'
        };
    } else {
        return {};
    }
}