import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'

import login from './components/login'
import directory from './components/directory'
import home from './components/home'
import myProfile from './components/myProfile'
import admin from './components/admin'
import impersonation from './components/impersonation'
import share from './components/share'
import resetPassword from './components/resetPassword'
import verifyRegistration from './components/verifyRegistration'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFile, faUser, faEnvelope, faKey, faFolderOpen, faTrashAlt, faUserCircle, faSignOutAlt, faUpload, faBars, faAngleLeft, faPeopleCarry, faShare, faDownload} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {Api} from './api';
import store from './store/store';
import Toast, {TYPE} from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
    // You can set your default options here
    toastDefaults: {
      // ToastOptions object for each type of toast
      [TYPE.ERROR]: {
          timeout: 5000,
          closeButton: false,
          hideProgressBar: true,
          position: 'bottom-center'
      },
      [TYPE.SUCCESS]: {
          timeout: 5000,
          hideProgressBar: true,
          position: 'bottom-center'
      },
      [TYPE.WARNING]: {
          timeout: 5000,
          hideProgressBar: true,
          position: 'bottom-center'
      }
      
  }
};



library.add(faFile, faUser, faEnvelope, faKey, faFolderOpen, faTrashAlt, faUserCircle, faSignOutAlt, faUpload, faBars, faAngleLeft, faPeopleCarry, faShare, faDownload)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Toast, options);

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
    path: '/resetPassword*',
    name: 'resetPassword',
    component: resetPassword
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
  else if(to.name == 'resetPassword'){
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
      //console.log("all good from jwt,", res);
      next();
    }
    else if(res.data.status == 401)
    {
      //console.log("JWT issue,", res);
      next({name: 'login'});
    }
  }
})
  
new Vue({
  store,
  router
}).$mount('#app')


