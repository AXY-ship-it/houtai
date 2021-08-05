import {request} from './api'
export function getRights(){
   return request({
    url:'/rights/list'
   })
}
export function getRoles(){
    return request({
        url:'/roles',
        
    })
}
export function removeTag(roleId,rightId){
    return request({
        url:`/roles/${roleId}/rights/${rightId}`,
        method:'delete'
    })
}
export function getAllRights(){
    return request({
        url:'/rights/tree',
        method:'get'
    })
}
export function setRights(roleId,rids){
    return request({
       url:`/roles/${roleId}/rights`,
       method:'post',
       data:{
           rids
       }
    })
}