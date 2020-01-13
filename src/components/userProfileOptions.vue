<template>
   
    <div class="userOptions">
        <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
            <b-dropdown variant="md-layout">
                <template slot="button-content">
                    <font-awesome-icon icon="user-circle" size="2x" class="icon"></font-awesome-icon>      
                </template>
                <b-dropdown-item v-bind:href="url + 'myProfile'">
                    <font-awesome-icon icon="user"></font-awesome-icon>
                    <span class="dropdown-text" > My Profile </span> 
                </b-dropdown-item>
                <b-dropdown-item>
                    <font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
                    <span class="dropdown-text" @click="signOut"> Sign Out </span>
                </b-dropdown-item>
            </b-dropdown>
        </div>
   
</template>

<script>
import {Api} from '../api';
import '../../node_modules/vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
export default {
    name: 'userOptions',
    data(){
        return{
            url: "http://localhost:8080/#/",
            isLoading: false,
            fullPage: true
        }
    },
    components:{
        Loading
    },
    methods:{
        async signOut()
        {
            let api = new Api();
            this.isLoading = true;
            const res = await api.getData('/home/logout',{});
            
            console.log("LOGOUT", res);
            this.isLoading = false;
            if(res.data.status == 200)
                {
                    this.$router.push({name: 'login'});
                }
                else if(res.data.status == 401)
                {
                    this.$router.push({name: 'login'});
                }
                else 
                {
                    this.$notify({
                            group: 'notify',
                            title: 'Mind Refreshing?',
                            type: 'error',
                            text:  res.data.message,
                            duration: 10000
                        })
                } 
       
        }
    }

}
</script>

<style scoped>
.userOptions
{
    /* float: left; */
    width:150px;
    margin-right: 50px;
    /* margin-top: 0px; */
}

.dropdown-text {
    text-decoration: none;
    color: black;
}
data-icon {
     text-decoration: none;
  color: black;
}
</style>