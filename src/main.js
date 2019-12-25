import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import Notifications from 'vue-notification';

import login from './components/login'
import directory from './components/directory'
import home from './components/home'
import myProfile from './components/myProfile'
import admin from './components/admin'
import impersonation from './components/impersonation'
import share from './components/share'
import verifyRegistration from './components/verifyRegistration'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFile, faUser, faEnvelope, faKey, faFolderOpen, faTrashAlt, faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueCookies from 'vue-cookies';
import {Api} from './api';
library.add(faFile, faUser, faEnvelope, faKey, faFolderOpen, faTrashAlt, faUserCircle, faSignOutAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Notifications)
Vue.use(VueCookies)
Vue.use(VueMaterial)
//Vue.use(jwtDecode);
Vue.config.productionTip = false

const routes = [

  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/',
    name: 'home',
    component: home
   },
  {
    path: '/admin',
    name: 'admin',
    component: admin
  },
  {
    path: '/impersonation',
    name: 'impersonation',
    component: impersonation
  },
  {
    path:'/myProfile',
    name: 'myProfile',
    component: myProfile
  },
  {
    path: '/share',
    name: 'share',
    component: share
  },
  {
    path: '/verifyRegistration*',
    name: 'verifyRegistration',
    component: verifyRegistration
  },
  {
    path: '/*:name?',
    name: 'directory',
    component: directory
    
  },
  

];

const router = new VueRouter({
  routes // short for `routes: routes`
})
router.beforeEach(async (to, from, next) => {
  if(to.name == 'login')
  {
    next();
  }
  else if(to.name == 'verifyRegistration'){
    next();
  }
  // else if(to.name == 'share')
  // {
  //   let api = new Api();
  //   const res = await api.getData('/check', {});
  //   if(res.data.status == 200)
  //   {
  //     const check = await api.checkDirectory(to)
  //     console.log("Check", check)
  //     if(check.data.status == 200)
  //     {
  //         console.log("Go to directory!");
  //         next({name: 'directory', params: {name: 'share'}});
  //     }
  //   }
  //   else{
  //     next({name: 'share'});
  //   }
  // }
  else
  {
    let api = new Api();
    const res = await api.getData('/check', {});
    
    if(res.data.status == 200)
    {
      console.log("all good from jwt,", res);
      next();
    }
    else if(res.data.status == 401)
    {
      console.log("JWT issue,", res);
      next({name: 'login'});
    }
  }
})
  
new Vue({
  router
}).$mount('#app')


