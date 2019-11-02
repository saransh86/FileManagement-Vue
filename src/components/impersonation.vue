<template>
    <div class="index-page">
         <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <notifications group ="notify" position="top center"/>
         <userOptions/>
        <h2> Welcome Admin </h2>
        <div class="cards">
            <b-card title="Card Title" no-body>
                <b-card-header header-tag="nav">
                    <b-nav card-header tabs>
                        <!-- <b-nav tabs fill align="center" div="nav" variant="dark"> -->
                        <b-nav-item  to="/admin">Users</b-nav-item>
                        <b-nav-item active to="/impersonation">Impersonation</b-nav-item>
                    </b-nav>
                </b-card-header>
            </b-card>
        </div>
        <!-- <b-nav tabs fill align="center" div="nav">
            <b-nav-item to="/admin">Users</b-nav-item>
            <b-nav-item active="" to="/impersonation">Impersonation</b-nav-item>
        </b-nav> -->
        <div class="searchBar">
            <b-container>
                <b-row>
                    <b-col cols="4">
                        <vue-select placeholder="Search Users" @input="setSelected" :clearable="false" v-model="selected" :options="allUsers" ></vue-select>
                    </b-col>
                </b-row>
            </b-container>
        </div>
        <div  class="layout">
            <div v-for="(file) in files" :key="file.fileName">
                <font-awesome-icon icon="file" size="2x"></font-awesome-icon>
                <span class="data" :value=file.fileName> {{file.fileName}}</span>
                
                <!-- <font-awesome-icon icon="trash-alt" class="delete" :name=file size="2x" v-on:click="deleteFile"></font-awesome-icon> -->
            </div>
        </div>
    </div>
</template>

<script>
import 'vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import userOptions from './userProfileOptions'
import VueSelect from 'vue-select';
import {Api} from '../api';
import 'vue-select/dist/vue-select.css';
export default {
    name: 'impersonation',
    async mounted() {
        this.isLoading = true;
        let api = new Api();
        const is_admin = await api.getData('/user/is_admin',{params: ''});
        console.log("IS Admin:", is_admin);
        if(!is_admin.data.data){
            this.$router.push({name: 'home'});
        }
        else{
            const res = await api.getUsers('/home/getusers');
            this.isLoading = false;
            if(res.data.status == 200)
            {
                console.log("Got the data", res);
                this.allUsers = res.data.data;
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
    data(){
        return {
            isLoading: false,
            allUsers: [],
            fullPage: true,
            selected: null,
            files: []
        }
    },
    components:{
        Loading,
        userOptions,
        VueSelect
    },
    methods: {
        async setSelected(value) {
            console.log("On change", value);
            this.isLoading = true;
            let api = new Api();
            const res = await api.getData('/user/get_files',{userImpersonation: value});
            this.isLoading = false;
            console.log("User impsersomation : ", res);
            this.files = res.data.data;
            //  trigger a mutation, or dispatch an action  
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
.searchBar{
    position: relative;
    top:20px;
    float: center;
    bottom: 20px;
}
.layout {
    position: relative;
    /* right: 100px; */
    top: 50px;
    /* left:inherit;
    right: inherit; */
    /*padding: 20px; */
    background-color: white;
    overflow: scroll;
    max-height: 300px;  
}

.container{
    padding-right: 0px;
    padding-left: 0px;
    margin-right: 0px;
    margin-left: 0px;
}
.card{
    margin-top: 35px;
    margin-right: 0px;
}
</style>