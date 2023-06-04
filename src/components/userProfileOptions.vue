<template>
   
    <div >
        <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <md-menu md-size="medium" md-align-trigger>
            <!-- <b-dropdown variant="md-layout">
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
            </b-dropdown> -->
            <md-button md-menu-trigger>
                <font-awesome-icon icon="user-circle" size="2x" class="icon"></font-awesome-icon>
            </md-button>
            <md-menu-content> 
                <md-menu-item v-bind:href="url + 'myProfile'">
                    <!-- <font-awesome-icon icon="user"></font-awesome-icon> -->
                    <span> My Profile </span>
                </md-menu-item>
                <md-menu-item class="pointer" v-bind:href="url">
                    <!-- <font-awesome-icon icon="sign-out-alt"></font-awesome-icon> -->
                    <span  @click="signOut">Sign Out </span>
                </md-menu-item>
            </md-menu-content>
        </md-menu>
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
            url: Api.getUrl() + "/#/",
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
            this.isLoading = false;
            if(res.data.status == 200)
                {
                    this.$store.dispatch('reset');
                    this.$router.push({name: 'login'});
                }
            else if(res.data.status == 401)
                {
                    this.$store.dispatch('reset');
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
.pointer {cursor: pointer;}
</style>