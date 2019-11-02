<template>
    <div class="user-page">
        <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <notifications group ="notify" position="top center"/>
        <div class="user-profile">
            <b-container class="main-container">
                <b-row align-h="between">
                    <b-col cols="auto">
                        <div v-if="!isAdmin">
                            <h4>
                                <a :href="url + '/welcome'"> Home > </a>
                                <span>My Profile</span>
                            </h4>
                        </div>
                        <div v-else-if="isAdmin">
                            <h4>
                                <a :href="url + 'admin'"> Home > </a>
                                <span>My Profile</span>
                            </h4>
                        </div>
                    </b-col>
                    <b-col cols="auto">
                        <userOptions/>
                    </b-col>
                </b-row>
                <b-row align-h="center">
                    <b-col cols="auto" md=1>
                        <font-awesome-icon icon="user" size="2x" class="input-container"></font-awesome-icon>
                    </b-col>
                    <b-col cols="auto" md=4>
                        <b-form-group :state="usernameState" :invalid-feedback="invalidFeedbackUsername" class="input-container">
                            <b-form-input id="registerUsername" v-model="username" :state="usernameState" required  class="input-group-text "> </b-form-input>
                            </b-form-group>
                    </b-col>
                </b-row>

                <b-row align-h="center">
                    <b-col cols="auto" md=1>
                        <font-awesome-icon icon="envelope" size="2x" class="input-container"></font-awesome-icon>
                    </b-col>
                    <b-col cols="auto" md=4>
                        <b-form-group :state="emailState" :invalid-feedback="invalidFeedbackEmail" class="input-container">
                            <b-form-input id="registerEmail" v-model="email" :state="emailState" required class="input-group-text "> </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row align-h="center">
                    <b-col cols="auto" md=1>   
                    </b-col>
                    <b-col cols="auto" md=4>
                        <b-form-group class="input-container">
                            <button class="btn btn-primary btn-block"  type="button"  v-on:click="updateProfile"> Update </button>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
import '../../node_modules/vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {Api} from '../api';
import userOptions from './userProfileOptions';
export default {
    name: 'myProfile',
    
    components: {
        Loading,
        userOptions
    },
    async mounted(){
        let api = new Api();
        this.isLoading = true;
        const res = await api.getData('/user/userProfile');
        const resAdmin = await api.getData('/user/is_admin',{params: ''});
        this.isAdmin = resAdmin.data.data;
        setTimeout(() => {
            this.isLoading = false;
            console.log("Got the user Profile", res);
            if(res.data.status == 200)
            {
                this.username = res.data.message.username;
                this.email = res.data.message.email;
                this.currentUsername = this.username;
                this.currentEmail = this.email;
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
                        text: "Cannot get user details at this time. Embarassing...",
                        duration: 10000
                    })
            }
        }, 500);
        
    },
    data()
    {
        return {
            url: "http://localhost:8080/#/",
            usernameState : null,
            emailState: null,
            username : '',
            email: '',
            invalidFeedbackEmail: '',
            invalidFeedbackUsername: '',
            currentUsername: '',
            currentEmail: '',
            isLoading: false,
            fullPage: true,
            isAdmin: null
        }
    },
    methods:
    {
        async updateProfile()
        {
            if(this.currentUsername == this.username && this.currentEmail == this.email)
            {
                this.usernameState = "invalid";
                this.emailState = "invalid";
                this.invalidFeedbackEmail = "Hmm. seems email was not changed";
                this.invalidFeedbackUsername = "Hmm, seems username was not changed";
                return;
            }
            else{
                let api = new Api();
                this.usernameState = "valid";
                this.emailState = "valid";
                this.isLoading = true;
                setTimeout(async() => {
                    this.isLoading = false;
                    const res = await api.putData('/user/updateMyProfile',{myProfileUsername: this.username, myProfileEmail: this.email, originalEmail: this.currentEmail});
                    if(res.data.status == 200)
                    {
                        this.$notify({
                            group: 'notify',
                            title: 'Profile Update',
                            type: 'success',
                            text: res.data.message,
                            duration: 10000
                        })
                    }
                    else if (res.data.status == 401)
                    {
                        this.$router.push({name: 'login'});
                    }
                    else
                    {
                        this.$notify({
                            group: 'notify',
                            title: 'Profile Update',
                            type: 'error',
                            text: res.data.message,
                            duration: 10000
                        })
                    }
                }, 1000);

            }
        },
        async signOut()
        {
            let api = new Api();
            const res = api.getData('/home/logout',{});
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

.user-page{
  position: fixed;;
  right: 100px;
  top: 70px;
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
.input-container {
  display: flex;
  top: 10px;
  margin-bottom: 15px;
  position: relative;
  justify-content: center;
}
a {
  text-decoration: none;
  color: black;
}
.main-container{
    padding-right: 0px;
    padding-left: 0px;
    margin-right: 0px;
    margin-left: 0px;
}

</style>
