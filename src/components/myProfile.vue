<template>
    <div class="user-page">
        <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <notifications group ="notify" position="top center"/>
        <div class="userOptions">
            <b-dropdown class="m-md-2" variant="light">
                <template slot="button-content">
                    <font-awesome-icon icon="user-circle" size="3x"></font-awesome-icon>     
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
        <h4>
            <a :href="url + '/welcome'"> Home > </a>
            <span>My Profile</span>
        </h4>
        <div class="user-profile">
            <b-container>
                <b-row>
                    <b-col cols="2">
                        <font-awesome-icon icon="user" size="2x" class="input-container"></font-awesome-icon>
                    </b-col>
                    <b-col align-self="center" cols="10">
                        <b-form-group :state="usernameState" :invalid-feedback="invalidFeedbackUsername" class="input-container">
                            <b-form-input id="registerUsername" v-model="username" :state="usernameState" required  class="input-group-text col-10"> </b-form-input>
                            </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="2">
                        <font-awesome-icon icon="envelope" size="2x" class="input-container"></font-awesome-icon>
                    </b-col>
                    <b-col align-self="center" cols="10">
                        <b-form-group :state="emailState" :invalid-feedback="invalidFeedbackEmail" class="input-container">
                            <b-form-input id="registerEmail" v-model="email" :state="emailState" required class="input-group-text col-10"> </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="2">
                        <span> </span>
                    </b-col>
                    <b-col align-self="center" cols="10">
                        <b-form-group class="input-container">
                            <button class="btn btn-primary col-10"  type="button"  v-on:click="updateProfile"> Update </button>
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
export default {
    name: 'myProfile',
    
    components: {
        Loading
    },
    async mounted(){
        let api = new Api();
        this.isLoading = true;
        const res = await api.getData('/user/userProfile');
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
  position:fixed;
  right: 100px;
  top: 70px;
  left:100px;
  padding: 20px;
  background-color: white;
}
.user-profile{
  position: relative;
  background-color: white;
  width: 50%;
  top: 100%;
  margin: 0 auto;
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
.userOptions
{
    float:right;
    width:100px;
   
}

</style>
