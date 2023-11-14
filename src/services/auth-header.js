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