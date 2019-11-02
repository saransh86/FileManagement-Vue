<template>
    <div class="userOptions">
            <b-dropdown class="m-2" variant="light">
                <template slot="button-content">
                    <font-awesome-icon icon="user-circle" size="2x" class="icon"></font-awesome-icon>     
                </template>
                <b-dropdown-item v-bind:href="url + 'myProfile'">
                    <font-awesome-icon icon="user"></font-awesome-icon>
                    <span class="dropdown-text" > My Profile </span> 
                </b-dropdown-item>
                <b-dropdown-item href="/logout">
                    <font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
                    <span class="dropdown-text" v-on:click="signOut"> Sign Out </span>
                </b-dropdown-item>
            </b-dropdown>
        </div>
</template>

<script>
import {Api} from '../api';
export default {
    name: 'userOptions',
    data(){
        return{
            url: "http://localhost:8080/#/"
        }
    },
    methods:{
        async signOut()
        {
            let api = new Api();
            this.isLoading = true;
            const res = api.getData('/home/logout',{});
       
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
                        text: "Cannot logout at this time. Ugh! This sucks!",
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
    float:right;
    width:100px;
    margin-top: 0px;
}
.btn{
    padding: 10px;
}
</style>