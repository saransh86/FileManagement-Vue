<template>
    <div>
        <div class="index-page">
            <div class="vld-parent">
                <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
            
             <md-card class="md-layout-item md-size-100 md-small-size-100" >
                <md-card-header>
                   <div class="md-title">File Management Verify Registration</div>
               </md-card-header>
               <md-card-content>
                    <div  class="layout">
                        <div v-if="this.check">
                            <p> Thank you for Registering! You have successfully Registered! </p>
                            <md-button id="goToLogin" class="md-primary md-raised"  v-on:click="goToLogin">Login</md-button>
                        </div>
                        <div v-else>
                            <p>Oops! Looks like the link expired or you have already registered! </p>
                            <md-button id="resendEmail" class="md-primary md-raised"  v-on:click="resendEmail">Re-send Email</md-button>
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
            api : new Api()
        }
    },
    async mounted()
    {
        console.log("QP", this.$route.query.username);
        console.log("Token", this.$route.query.token);
    },
    components:{
        Loading
    },
    methods: {
        async goToLogin(){
           window.location = '/';
        },
        async resendEmail(){
            console.log("Resend Email!");
        }
    }
}
</script>
<style scoped>
.index-page{
  position:fixed;
  right: 100px;
  top: 60px;
  left:100px;
  padding: 20px;
  background-color: white;
  /* overflow:auto; */
}

.layout {
    position: relative;
    /* right: 100px; */
    top: 20px;
    /* left:inherit;
    right: inherit; */
    /*padding: 20px; */
    background-color: white;
    overflow: scroll;
    max-height: 300px;  
}
</style>