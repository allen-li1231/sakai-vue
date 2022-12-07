import axios from 'axios';
import router from '@/router';


// for login and non-api interactions
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000/sakai';

export function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const $api = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8000/sakai',
});

$api.interceptors.request.use(
    (config) => {
        // attach csrf token in cookies to headers
        config.headers['X-CSRFToken'] = readCookie('csrftoken');
        return config;
    }
);
$api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.warn("error in api: ", error);
        const statusCode = error.response ? error.response.status : null;
        if (statusCode === 404) {
            router.push({ name: "notfound" });
        }
        else if (statusCode === 403 && error.response.data) {
            if (error.response.data['detail'] === 'Authentication credentials were not provided.') {
                router.push({ name: "login" });
            }
            else {
                router.push({ name: "error" });
            }
        }
        else if (statusCode === 400) {
            return Promise.reject(error);
        }
        else if (statusCode) {
            router.push({ name: "error" });
        }
        return Promise.reject(error);
    }
);

export default $api;