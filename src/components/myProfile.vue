<template>
    <div class="page-container">
        <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <notifications group="notify" position="top center" />
        <md-app>
            <md-app-toolbar class="md-primary "> 
                <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
                    <font-awesome-icon icon="bars"></font-awesome-icon>
                </md-button>
                <h3 class="md-title md-layout-item" style="flex :1"> File Management </h3>
                <div class="md-toolbar-section-end">
                    <div class="md-layout-item">
                        <div class="searchBar">
                            <vue-select placeholder="Search My Files" @input="setSelected" :clearable="false" label="fileName" v-model="selected" :options="this.allFiles" ></vue-select>
                        </div>
                    </div>
                    <userOptions/>
                </div>
            </md-app-toolbar>
            <md-app-drawer  :md-active.sync="menuVisible" md-persistent="mini" v-bind:style="styleObj">
                <md-toolbar class="md-transparent" md-elevation="0">
                    <span>
                        Welcome {{username}}
                    </span>

                    <div class="md-toolbar-section-end">
                        <md-button class="md-icon-button md-dense" @click="toggleMenu">
                            <font-awesome-icon icon="angle-left"></font-awesome-icon>
                        </md-button>
                    </div>
                </md-toolbar>
                <md-list>
                </md-list>
            </md-app-drawer>
        
            <md-app-content>
                <md-list>
                    <form novalidate class="md-layout-item" @submit.prevent="validateProfile">
                    <md-list-item class="md-size-15">
                        <div >
                            <a :href="url + '/welcome'"> <span class="space"> Home </span></a>
                            <span class="space"> > My Profile</span>
                        </div>
                    </md-list-item>
                    <md-list-item>
                        <md-field :class="getValidationClass('username')" class="md-layout-item" >
                            <label for="username">Username</label>
                            <md-input id="registerUsername"  :placeholder="username" v-model="form.username " class="md-layout-item md-size-50"> </md-input>
                            <span class="md-error" v-if="!$v.form.username.required">The username is required</span>
                            <span class="md-error" v-else-if="!$v.form.username.minlength">Minimum length of username should be 5</span>
                        </md-field>
                    </md-list-item>
                    <md-list-item>
                        <md-field>
                            <label for="email"> Email </label>
                            <md-input id="registerEmail" :value=email disabled> </md-input>
                        </md-field>
                    </md-list-item>
                    <md-list-item>
                        <div class="md-layout-item">
                            <md-button id="changePassword" class="md-layout-item md-primary md-raised md-size-100" @click="changePasswordModal= true">Change Password</md-button>
                        </div>
                    </md-list-item>
                    <md-list-item>
                        <div class="md-layout-item ">
                            <md-button type="submit" class="md-layout-item md-primary md-raised md-size-100">Update Profile</md-button>
                        </div>
                    </md-list-item>
                    </form>
                </md-list>
            </md-app-content>
        </md-app>

        <!--Modal for change password-->
        <md-dialog :md-active.sync="changePasswordModal" v-on:md-closed="clearUpdatePasswordForm" @md-opened="hideDrawer" @md-closed="showDrawer">
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

</template>

<script>
import userOptions from './userProfileOptions';
import VueSelect from 'vue-select';
import '../../node_modules/vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {Api} from '../api';

import { validationMixin } from 'vuelidate';
import {sameAs} from 'vuelidate/lib/validators';
import {
    required,
    minLength
  } from 'vuelidate/lib/validators'
export default {
    name: 'myProfile',
    mixins: [validationMixin],
    components: {
        Loading,
        VueSelect,
        userOptions
    },
    async created(){
        this.$store.dispatch('getFilesAndDirectories','root/home')
    },
    computed: {
        allFiles() {
            return this.$store.getters.getAllFiles;
        },
        username(){
            return this.$store.getters.getUsername
        },
        email () {
            return this.$store.getters.getEmail;
        },
        menuVisible(){
            return this.$store.getters.getShowMenu;
        }
    },
    data()
    {
        return {
            url: Api.getUrl() + "/#/",
            selected: null,
            // menuVisible: false,
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
            },
            sending : false,
            styleObj:{
                zIndex: null
            },

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
            }
        }
    },
    methods:
    { 
        hideDrawer(){
            this.styleObj.zIndex = "auto";
        },
        showDrawer(){
            this.styleObj.zIndex=null;
        },
        toggleMenu () {
            // this.menuVisible = !this.menuVisible;
            let menu = !this.menuVisible;
            this.$store.commit('getShowMenu', menu);
        },
        setSelected(value) {
            location.href = value.path;
        },
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
            
            if((!this.$v.form.username.$invalid )){
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
                    const res = await api.putData('/user/updateMyProfile',{myProfileUsername: this.form.username});
                    if(res.data.status == 200)
                    {
                        this.$store.commit('getUsername',this.form.username);
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
<style>
.md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
    border: 1px solid rgba(0,0,0, .12);
}
.md-app{
    min-height: 350px;
    border: 1px solid rgba(0,0,0, .12);   
}

.searchBar{
    
    background: white;
}
.pointer {cursor: pointer;}
.space{
    color: black;
}
.md-dialog {
    overflow: visible;
}
.md-dialog-content {
    overflow: visible;
}
.md-theme-default a  {
    color: black;
}
.md-list-item{
    z-index: 0;
}
</style>
