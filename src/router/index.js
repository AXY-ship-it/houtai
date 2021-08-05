import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const Login=()=>import('@/view/profile/Login.vue')
const Home=()=>import('@/view/home/Home.vue')
const Welcome=()=>import('@/view/home/childs/Welcome.vue')
const Goods=()=>import('@/view/home/childs/Goods.vue')
const Orders=()=>import('@/view/home/childs/Orders.vue')
const Reports=()=>import('@/view/home/childs/Reports.vue')
const Users=()=>import('@/view/home/childs/Users.vue')
const Rights=()=>import('@/view/home/childs/Rights.vue')
const Roles=()=>import('@/view/home/childs/Roles.vue')
const Categories=()=>import('@/view/home/childs/Categories.vue')
const Params=()=>import('@/view/home/childs/Params.vue')
const routes=[
    {
        path:'',
        redirect:'/login'
    },
    {
        path:'/home',
        component:Home,
        meta:{
            title:'首页'
        },
        redirect:'/welcome',
        children:[
            {
                path:'',
                redirect:'/users'
            },
            {
                path:'/welcome',
                component:Welcome
            },
            {
                path:'/users',
                component:Users
            },
            {
                path:'/orders',
                component:Orders
            },
            {
                path:'/rights',
                component:Rights
            },
            {
                path:'/goods',
                component:Goods
            },
            {
                path:'/reports',
                component:Reports
            },{
                path:'/roles',
                component:Roles
            },{
                path:'/categories',
                component:Categories
            },
            {
                path:'/params',
                component:Params
            }
        ]
    },
    {
        path:'/login',
        component:Login,
        meta:{
            title:'登录'
        }
    }
]
const router=new VueRouter({
    routes,
    mode:'history'
})
router.beforeEach((to,from,next)=>{
    if(to.path=='/login') return next()
    const tokenStr=window.sessionStorage.getItem('token')
    if(!tokenStr){
        return next('/login')
    }
    next()
})
export default router