import axios, {AxiosError, AxiosResponse} from 'axios';
import { toast } from 'react-toastify';
import { Activity, ActivityFormValues } from '../models/activity';
import { history } from '../../index';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/user';
import {Photo, Profile } from '../models/profile';
import { PaginatedResult } from '../models/pagination';

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    
    switch (status) {
        case 400:
            if (typeof data === 'string') {
                toast.error(data);
            }
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                // When GUID not found
                history.push('/not-found');
            }
            if (data.errors) {
                const modalStateErros = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErros.push(data.errors[key]);
                    }
                }
                throw modalStateErros.flat();
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    
    return Promise.reject(error);
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', {params})
        .then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}

const Profiles = {
    get: (userName: string) => requests.get<Profile>(`/profiles/${userName}`),
    edit: (profile: Partial<Profile>) => requests.put<void>('/profiles', profile),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('/photos', formData, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(responseBody);
    },
    setMainPhoto: (id: string) => requests.post<void>(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del<void>(`/photos/${id}`),
    updateFollowing: (userName: string) => requests.post(`/followings/${userName}`, {}),
    listFollowings: (userName: string, predicate: string) => 
        requests.get<Profile[]>(`/followings/${userName}?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;