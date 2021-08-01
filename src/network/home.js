import {request} from './api'
export function getMenu(username,password){
    return request({
        url:'/menus',
        method:'get',
        params:{
            username,
            password
        }
    })
}
export function getUsers(query,pagenum,pagesize){
    return request({
        url:'/users',
        params:{
            query,
            pagenum,
            pagesize
        }
    })
}
export function updateUserState(userInfo){
    return request({
        url:`/users/${userInfo.id}/state/${userInfo.mg_state}`
    })
}
export function addUsers(userInfo){
    return request({
        url:'/users',
        method:'post',
        data:userInfo
    })
}
export function selectById(id){
    return request({
        url:'/users/',
        method:'get',
        params:{
            id
        }
    })
}
export function deleteUser(id){
    return request({
        url:'/users/',
        method:'delete',
        params:{
            id
        }
    })
}