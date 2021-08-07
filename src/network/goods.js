import {request} from './api'
export function getAllGoods(query){
    return request({
        url:'/goods',
        params:{
            pagenum:query.pagenum,
            pagesize:query.pagesize
        }
    })
}
// 根据商品id查询商品
export function selectGoodById(id){
     return request({
         url:`/goods/${id}`
     })
}
//提交修改后的商品信息
export function editGoods(goodsInfo){
    return request({
        url:`/goods/${goodsInfo.goods_id}`,
        method:'put',
        data:goodsInfo
    })
}
//删除商品
export function deleteGoods(id){
    return request({
        url:`/goods/${id}`,
        method:'delete'
    })
}