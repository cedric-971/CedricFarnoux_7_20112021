



const Signup ={
    template : '#signup',
    name :'Signup'
 }
 const Login ={
    template : '#login',
    name :'Login'
 }

 const router = new VueRouter({

    routes:[

    
    {path: '/signup', component: Signup, name: 'Signup' },
    {path: '/login', component: Login, name: 'Login' },
    
    
    
    ]

 })


const vue = new Vue({ 
    router
}).$mount('#app');