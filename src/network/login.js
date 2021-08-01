import {request} from './api'
export function getLogin(username,password){
    return request({
        url:'/login',
        method:'post',
        data:{
            username,
            password
        }
    })
}