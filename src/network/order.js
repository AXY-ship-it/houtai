import {request} from './api'
export function getOrderList(query){
    return request({
        url:'/orders',
        params:query
    })
}
// 修改订单状态
export function editOrder(orderInfo){
    return request({
        url:`/orders/${orderInfo.id}`,
        method:'put',
        data:{
            is_send:orderInfo.is_send,
            order_pay:orderInfo.order_pay,
            order_price:orderInfo.order_price,
            order_number:orderInfo.order_number,
            pay_status:orderInfo.pay_status
        }
    })
}