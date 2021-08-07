import {request} from './api'
// 分页获取商品
export function getCategoriesList(queryInfo){
    return request({
        url:'/categories',
        params:{
            type:queryInfo.type,
            pagenum:queryInfo.pagenum,
            pagesize:queryInfo.pagesize
        }
    })
}
//获取全部商品分类
export function getAllCate(){
    return request({
        url:'/categories',
        params:{
            type:2
        }
    })
}
//添加商品分类
export function addCateParent(cateInfo){
    return request({
        url:'/categories',
        method:'post',
        data:{
            cat_pid:cateInfo.cat_pid,
            cat_name:cateInfo.cat_name,
            cat_level:cateInfo.cat_level
        }
    })
}
//根据id查询商品分类名称
export function selectCateById(id){
    return request({
        url:`/categories/${id}`
    })
}
//编辑提交分类
export function confirmEditCate(cateInfo){
    return request({
        url:`categories/${cateInfo.cat_id}`,
        method:'put',
        data:{
            cat_name:cateInfo.cat_name
        }
    })
}
//删除分类
export function deleteCate(id){
    return request({
        url:`categories/${id}`,
        method:'delete'
    })
}
