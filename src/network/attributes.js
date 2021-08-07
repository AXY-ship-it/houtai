import {request} from './api'
//分类参数管理
export function getAttributes(id,sel){
    return request({
        url:`categories/${id}/attributes`,
        method:'get',
        params:{
           sel
        }
    })
}
//获取全部商品分类
export function getAllCateList(){
    return request({
        url:'/categories',
    })
}
//根据id查询参数
export function getParamsById(paramsInfo){
    return request({
        url:`categories/${paramsInfo.id}/attributes/${paramsInfo.attrId}`,
        params:{
            attr_sel:paramsInfo.attr_sel,
            attr_vals:paramsInfo.attr_vals
        }
    })

}
//编辑提交参数
export function confirmParamsEdit(paramsInfo){
    return request({
        url:`categories/${paramsInfo.id}/attributes/${paramsInfo.attr_id}`,
        method:'put',
        data:{
            attr_name:paramsInfo.attr_name,
            attr_sel:paramsInfo.attr_sel,
            attr_vals:paramsInfo.attr_vals
        }
    })
}
// 添加静态或者动态参数
export function addParams(id,attr_name,attr_sel){
    return request({
        url:`categories/${id}/attributes`,
        method:'post',
        data:{
            attr_name,
            attr_sel
        }
    })
}
//删除参数
export function deleteParams(id,attrid){
    return request({
        url:`categories/${id}/attributes/${attrid}`,
        method:'delete',
    })
}
