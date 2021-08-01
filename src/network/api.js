import axios from 'axios'
export function request(config){
    const instance=axios.create({
        baseURL:'https://test.qhhz.xyz:8888/api/private/v1',
        timeout:5000
        // contentType:'application/json'
    })
    instance.interceptors.request.use(res=>{
       res.headers.Authorization=window.sessionStorage.getItem('token')
       return res
    },err=>{
        console.log(err)
    })
    return instance(config)
    
}