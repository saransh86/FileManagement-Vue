<template>
<div>
    <notifications group ="notify" position="top center"/>
    <navBar/>
    <div class="user-page">
        <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <div class="user-profile">
        <form novalidate class="md-layout-item" @submit.prevent="validateProfile">
            <md-card>
                <md-card-header>
                    <div v-if="!isAdmin">
                        <a :href="url + '/welcome'"> <span class="md-title"> Home >  </span></a>
                        <span class="md-title">My Profile</span>
                    </div>
                    <div v-else-if="isAdmin">
                        <a :href="url + 'admin'"> <span class="md-title">Home > </span> </a>
                        <span class="md-title">My Profile</span>
                    </div>
                    </md-card-header>
                    <md-card-content>
                        <div class="md-layout-item md-size-25">
                            <md-field :class="getValidationClass('username')">
                                <label for="username">Username</label>
                                <md-input id="registerUsername" v-model="form.username"> </md-input>
                                <span class="md-error" v-if="!$v.form.username.required">The username is required</span>
                                <span class="md-error" v-else-if="!$v.form.username.minlength">Minimum length of username should be 5</span>
                            </md-field>
                        </div>

                        <div class="md-layout-item md-size-25">
                            <md-field :class="getValidationClass('username')">
                                <label for="email"> Email </label>
                                <md-input id="registerEmail" v-model="form.email"> </md-input>
                                <span class="md-error" v-if="!$v.form.email.required">The email is required.</span>
                                <span class="md-error" v-else-if="!$v.form.email.email">Invalid email.</span>
                            </md-field>
                        </div>

                        

                        <div class="md-layout-item md-size-25">
                            <md-button id="changePassword" class="md-layout-item md-primary md-raised md-size-100" @click="changePasswordModal= true">Change Password</md-button>
                        </div>

                        <div class="md-layout-item md-size-25">
                            <md-button type="submit" class="md-layout-item md-primary md-raised md-size-100">Update Profile</md-button>
                        </div>
                    </md-card-content>
            
                </md-card>
        </form>
        </div>

        <!-- <div class="user-profile">
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
                            <button class="btn btn-success btn-block"  type="button"  v-b-modal.changePassword> Change Password </button>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row align-h="center">
                    <b-col cols="auto" md=1>   
                    </b-col>
                    <b-col cols="auto" md=4>
                        <b-form-group class="input-container">
                            <button class="btn btn-success btn-block"  type="button"  v-on:click="updateProfile"> Update </button>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>
        </div> -->
        <!-- <b-modal id='changePassword' ref="modal" title="Alright Lets do this!" @show="resetModal" @hidden="resetModal" @ok="handleChangePassword" ok-variant="success" cancel-variant="success">
            <form ref="form" @submit.stop.prevent="handleChangePassword">
                
                    <b-container>    
                        <b-row>
                            <b-col cols="2">
                                <font-awesome-icon icon="key" size="2x" class="input-container"></font-awesome-icon>
                            </b-col>
                        <b-col align-self="center" cols="10">
                            <b-form-group :state="currentPasswordState"  :invalid-feedback="invalidFeedbackCurrentPassword" class="input-container"> 
                                <b-form-input id="currentPassword" type="password" v-model="currentPassword" :state="currentPasswordState"  required placeholder="Current Password" class="input-group-text"> </b-form-input>
                             </b-form-group>
                        </b-col>
                        </b-row>

                        <b-row>
                            <b-col cols="2">
                                <font-awesome-icon icon="key" size="2x" class="input-container"></font-awesome-icon>
                            </b-col>
                            <b-col>
                                <b-form-group :state="newPasswordState"  :invalid-feedback="invalidFeedbackNewPassword" class="input-container"> 
                                    <b-form-input id="newPassword" type="password" v-model="newPassword" :state="newPasswordState"  required placeholder="New Password" class="input-group-text"> </b-form-input>
                             </b-form-group> 
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col cols="2">
                                <font-awesome-icon icon="key" size="2x" class="input-container"></font-awesome-icon>
                            </b-col>
                            <b-col>
                                <b-form-group :state="confirmNewPasswordState"  :invalid-feedback="invalidFeedbackConfirmNewPassword" class="input-container"> 
                                    <b-form-input id="confirmNewPassword" type="password" v-model="confirmNewPassword" :state="confirmNewPasswordState"  required placeholder="Confirm New Password" class="input-group-text"> </b-form-input>
                             </b-form-group> 
                            </b-col>
                        </b-row>
                    </b-container>
                
            </form>
        </b-modal> -->

        <!--Modal for change password-->
        <md-dialog :md-active.sync="changePasswordModal" v-on:md-closed="clearUpdatePasswordForm">
            <md-dialog-title> Change Password </md-dialog-title>
            <form novalidate class="md-layout-item md-size-100 md-medium-size-100" @submit.prevent="validateChangePassword">
                <md-dialog-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('currentPassword')">
                                <label for="currentPassword" > Current Password </label>
                                <md-input name="currentPassword" type="password" id="currentPassword" v-model="form.currentPassword" :disabled="sending"> </md-input>
                                <span class="md-error" v-if="!$v.form.currentPassword.required">The current password is required.</span>
                                <span class="md-error" v-else-if="!$v.form.currentPassword.minLength">Minimum password length should be 6.</span>
                            </md-field>
                        </div>
                    </div>

                    <div class="md-layout-item md-gutter">
                        <md-field :class="getValidationClass('newPassword')">
                            <label for="newPassword" > New Password </label>
                            <md-input name="newPassword" type="password" id="newPassword" v-model="form.newPassword" :disabled="sending"> </md-input>
                            <span class="md-error" v-if="!$v.form.newPassword.required">The new password is required.</span>
                            <span class="md-error" v-else-if="!$v.form.newPassword.minLength">Minimum password length should be 6.</span>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-gutter"> 
                        <md-field :class="getValidationClass('confirmNewPassword')">
                            <label for="confirmNewPassword"> Confirm New Password</label>
                            <md-input name="confirmNewPassword" type="password" id="confirmNewPassword" v-model="form.confirmNewPassword" :disable="sending"/>
                            <span class="md-error" v-if="!$v.form.confirmNewPassword.sameAsPassword">Password and Confirm Password do not match.</span> 
                        </md-field>
                    </div>
                 </md-dialog-content>
                  <md-dialog-actions >
                    <md-button class="md-primary" @click="changePasswordModal = false">Close</md-button>
                    <md-button type="submit" class="md-primary" :disabled="sending" >Save</md-button>
                </md-dialog-actions>
            </form>
        </md-dialog>

    </div>
    </div>
</template>

<script>
import '../../node_modules/vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {Api} from '../api';
import lodash from 'lodash';
import navBar from './navigationBar';
import userOptions from './userProfileOptions';
import { validationMixin } from 'vuelidate';
import {sameAs} from 'vuelidate/lib/validators';
import {
    required,
    email,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators'
export default {
    name: 'myProfile',
    mixins: [validationMixin],
    components: {
        Loading,
        navBar,
        userOptions
    },
    async mounted(){
        let api = new Api();
        this.isLoading = true;
        const res = await api.getData('/user/userProfile');
        const resAdmin = await api.getData('/user/is_admin',{params: ''});
        this.isAdmin = resAdmin.data.data;
        
            this.isLoading = false;
            if(res.data.status == 200)
            {
                this.form.username = res.data.message.username;
                this.form.email = res.data.message.email;
                this.checkUsername = res.data.message.username;
                this.checkEmail = res.data.message.email;
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
        
        
    },
    data()
    {
        return {
            url: Api.getUrl() + "/#/",
            //usernameState : null,

            // currentPassword: '',
            // currentPasswordState: null,
            // invalidFeedbackCurrentPassword: '',

            // newPassword: '',
            // newPasswordState: null,
            // invalidFeedbackNewPassword: '',

            // confirmNewPassword: '',
            // confirmNewPasswordState: null,
            // invalidFeedbackConfirmNewPassword: '',

            // emailState: null,
            // username : '',
            // email: '',
            // invalidFeedbackEmail: '',
            // invalidFeedbackUsername: '',
            // currentUsername: '',
            // currentEmail: '',
            checkUsername: null,
            checkEmail: null,
            isLoading: false,
            fullPage: true,
            isAdmin: null,
            changePasswordModal : false,
            form :{
                currentPassword: null,
                newPassword:null,
                confirmNewPassword: null,
                username: null,
                email: null
            },
            sending : false,

        }
    },
    validations: {
        form: {
            currentPassword:{
                required,
                minLength: minLength(6)
            },
            newPassword: {
                required,
                minLength: minLength(6)
            },
            confirmNewPassword: {
                 sameAsPassword : sameAs('newPassword')
            },
            username:{
                required,
                minLength: minLength(5)  
            },
            email:{
                required,
                email
            }

        }
    },
    methods:
    {
        getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
            return {
                'md-invalid': field.$invalid && field.$dirty
            }
            }
        },
        clearUpdatePasswordForm(){
            this.form.currentPassword = null;
            this.form.newPassword = null;
            this.form.confirmNewPassword = null;

            this.$v.form.currentPassword.$reset();
            this.$v.form.newPassword.$reset();
            this.$v.form.currentPassword.$reset();
        },
         validateChangePassword(){
            this.$v.form.currentPassword.$touch();
            this.$v.form.newPassword.$touch();
            this.$v.form.confirmNewPassword.$touch();
            if(!this.$v.form.currentPassword.$invalid && !this.$v.form.newPassword.$invalid && !this.$v.form.confirmNewPassword.$invalid){
                this.handleChangePassword();
            }
        },
        validateProfile(){
            this.$v.form.username.$touch();
            this.$v.form.email.$touch();
            
            if((!this.$v.form.username.$invalid && !this.$v.form.email.$invalid) && ((this.checkUsername != this.form.username) || (this.checkEmail != this.form.email))){
                this.updateProfile();
            }
        },
        resetModal()
        {
            this.currentPassword= '',
            this.currentPasswordState = null,
            this.newPassword = '',
            this.newPasswordState = null,
            this.confirmNewPassword = '',
            this.confirmNewPasswordState = null
        },
        async handleChangePassword()
        {
           
                this.changePasswordModal = false;
                this.isLoading = true;
                this.currentPasswordState = 'valid';
                this.newPasswordState = 'valid';
                this.confirmNewPasswordState = 'valid';
                let api = new Api();
                const res = await api.putData('/user/change_password', {newPassword: this.form.newPassword, currentPassword: this.form.currentPassword});
                this.isLoading = false;
                if(res.data.status == 300){
                    this.$notify({
                            group: 'notify',
                            title: 'Profile Update',
                            type: 'error',
                            text: res.data.message,
                            duration: 10000
                        })
                }
                else if(res.data.status == 400){
                    this.$router.push({name: 'login'});
                }
                else{
                    this.$notify({
                            group: 'notify',
                            title: 'Password Updated!',
                            type: 'success',
                            text: res.data.message,
                            duration: 10000
                        })
                }
               
            //}
        },
        async updateProfile()
        {
           
                let api = new Api();
                this.isLoading = true;
                
                    this.isLoading = false;
                    const res = await api.putData('/user/updateMyProfile',{myProfileUsername: this.form.username, myProfileEmail: this.form.email, originalEmail: this.checkEmail});
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
</script>
<style scoped>

.user-page{
  position: fixed;;
  right: 100px;
  top: 60px;
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
