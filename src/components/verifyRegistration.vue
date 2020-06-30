<template>
    <div>
        <div class="user-page">
            <div class="vld-parent">
                <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
            </div>
            <div class="user-profile">
                <md-card class="md-layout-item md-size-100 md-small-size-100" >
                    <md-card-header>
                        <div class="md-title">File Management Verify Registration</div>
                     </md-card-header>
                    <md-card-content>
                        <div  class="layout">
                            <div v-if="this.check">
                                <p>{{text}}</p>
                                <md-button id="goToLogin" class="md-primary md-raised"  v-on:click="goToLogin">Login</md-button>
                            </div>
                            <div v-else>
                                <p>{{text}} </p>
                                <div v-if="this.showLogin">
                                    <md-button id="goToLogin" class="md-primary md-raised"  v-on:click="goToLogin">Login</md-button>
                                </div>
                                <div v-else>
                                    <md-button id="resendEmail" class="md-primary md-raised"  v-on:click="resendEmail">Re-send Email</md-button>
                                </div>
                            
                            </div>
                        </div>
                    </md-card-content>
             </md-card>
            </div>
        </div>
  
    </div>
</template>

<script>
import '../../node_modules/vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {Api} from '../api';
export default {
    name: 'verifyRegistration',
    data(){
        return{
            check: null,
            isLoading: false,
            fullPage: true,
            api : new Api(),
            text: null,
            showLogin: null,
            email: null
        }
    },
    async mounted()
    {
        const email= this.$route.query.email;
        this.email = email;
        const token = this.$route.query.token;
        this.isLoading = true;
        let res = await this.api.postData('/verifyRegistration', {email: email, token: token});
        this.isLoading = false;
        if(res.data.status == 200){
            this.check = true;
            this.text = res.data.message;
        }
        else{
            
            this.check = false;
            if(res.data.status == 300){
                this.showLogin = true;
            }
            else{
                this.showLogin = false;
            }
            this.text = res.data.message;
           
        }
    },
    components:{
        Loading
    },
    methods: {
        async goToLogin(){
           window.location = '/';
        },
        async resendEmail(){
            this.isLoading = true;
            const res = await this.api.postData('/resendEmail', {email: this.email});
            
                this.text = res.data.message;
                this.showLogin = true;
                this.isLoading = false;
            
        }
    }
}
</script>
<style scoped>
.user-page{
  position: fixed;;
  right: 100px;
  top: 40px;
  left:100px;
  padding: 20px;
  background-color: white;
}
.user-profile{
  position: relative;
  background-color: white;
  /* width: 50%; */
  top: 100%;
  margin: 0;
  font-size: medium;
}
</style>