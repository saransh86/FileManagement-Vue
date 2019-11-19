<template>
<div>
    <navBar/>
<div class="index-page">
     <div class="vld-parent">
        <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
    </div>
    <notifications group ="notify" position="top center"/>
    <b-container class="main-container">
        <b-row align-h="between">
            <b-col cols="auto">
                <h2> Welcome Admin </h2>
            </b-col>
            <!-- <b-col cols="auto">
                 <userOptions/>
            </b-col> -->
        </b-row>
        <b-row align-h="start">
            <b-col cols="12">
                <b-card title="Card Title" no-body>
                    <b-card-header header-tag="nav">
                        <b-nav card-header tabs>
     <!-- <b-nav tabs fill align="center" div="nav" variant="dark"> -->
                            <b-nav-item active to="/admin">Users</b-nav-item>
                            <b-nav-item to="/impersonation">Impersonation</b-nav-item>
                        </b-nav>
                    </b-card-header>
                </b-card>
            </b-col>
        </b-row>
        <b-row align-h="start">
            <!-- <div class="admin-button"> -->
            <b-col cols="auto">
                <button class="btn btn-primary" id="deleteUser" type="button" > Disable </button>
            </b-col>
            <b-col cols="auto">
                <button class="btn btn-primary" id="disableUser" type="button" v-on:click="deleteUser"> Delete </button>
            </b-col>
            <!-- </div> -->
        </b-row>
    </b-container>
     
    
    
       
       
    
        <div  class="layout">
            <div :hidden="users.length == 0">
                <input type="checkbox" class="delete" v-on:click="selectAll" v-model="allSelected">
            </div>
            <div v-for="(user) in users" :key="user" >
                <input type="checkbox" :value=user v-model="checkedUsers" class="delete" v-on:click="select">
                <span class="data" > {{user}} </span>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import 'vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {Api} from '../api';
import lodash from 'lodash';
import navBar from './navigationBar';
export default {
    name: 'admin',
    data() {
        return {
            url: "http://localhost:8080/#/",
            users : [],
            selected : null,
            allSelected : false,
            isLoading: false,
            fullPage: true,
            checkedUsers: []
        }
    },
    async mounted () {
        //this.path = 'root/home';
        let api = new Api();
        /**
         * Check if user is admin first
         */
        const is_admin = await api.getData('/user/is_admin',{params: ''});
        console.log("IS Admin:", is_admin);
        if(!is_admin.data.data){
            this.$router.push({name: 'home'});
        }
        else{
            const res = await api.getUsers('/home/getusers')
            if(res.data.status == 200)
            {
                console.log("Got the data", res);
                this.users = res.data.data;
            }
            else if (res.data.status == 401)
            {
                this.$router.push({name: 'login'});
            }
            else
            {
                console.log("oops! Error!", res);
                this.$notify({
                    group: 'notify',
                    title: 'Cannot load files at this time.',
                    type: 'error',
                    text: "Uh ho. Something not right. Mind relogging?",
                    duration: 10000
                })
            } 
        }
        
    },
    components: {
        Loading,
        navBar
    },
    methods: {

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
       
        },
        async deleteUser(){
            console.log(this.checkedUsers);
            this.isLoading = true;
            setTimeout(async() => {
                this.isLoading = false;
                if(this.checkedUsers.length >0){
                let api = new Api();
                
                let res = await api.deleteFile('/user/delete_users', {deleteUsers: this.checkedUsers});
                if(res.data.status == 200){
                    this.users = this.users.filter(x => !this.checkedUsers.includes(x));
                    this.$notify({
                            group: 'notify',
                            title: 'Users deleted',
                            type: 'success',
                            text: "Feeling light!",
                            duration: 10000
                        }) 
                }
            }
            },2000)
            
        },
        selectAll()
        {
            console.log("ALL SELECTED", this.allSelected);
            this.checkedUsers = [];
            if(!this.allSelected)
            {
                for(var i =0; i<this.users.length; i++)
                {
                    this.checkedUsers.push(this.users[i]);
                }
            }
            else{
                this.checkedUsers = [];
            }
        },
        
        select()
        {
            this.allSelected = false;
        }
    }  
}
</script>

<style scoped>
.index-page{
  position:fixed;
  right: 100px;
  top: 70px;
  left:100px;
  padding: 20px;
  background-color: white;
  /* overflow:auto;  */
}
button {
    margin-right: 5px;
}
.admin-button{
    margin-top: 20px;
    
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
.card{
    margin-bottom: 20px;
}
.main-container{
    padding-right: 0px;
    padding-left: 0px;
    margin-right: 0px;
    margin-left: 0px;
}
</style>