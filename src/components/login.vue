<template>

    <div class="wrapper" >
        <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
            <div class='login'>
               
                <notifications group ="register" position="top center"/>
                <notifications group ="login" position="top center"/>


                    <form novalidate class="md-layout" @submit.prevent="validateUser">

                        <md-card class="md-layout-item md-size-100 md-medium-size-100"> 

                        <md-card-header>
                            <div class="md-title">File Management</div>
                        </md-card-header>
                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-field :class="getValidationClass('email')">
                                        <label for="email"> Email </label>
                                         <md-input name="email" id="email" v-model="form.email" :disabled="sending" />
                                        <span class="md-error" v-if="!$v.form.email.required">The email is required.</span>
                                        <span class="md-error" v-else-if="!$v.form.email.minlength">Invalid email.</span>
                                    </md-field>
                                </div>
                            </div>

                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-field :md-toggle-password="false" :class="getValidationClass('password')">
                                        <label for="password"> Password </label>
                                        <md-input name="password" type="password" id="password" v-model="form.password" :disabled="sending" />
                                        <span class="md-error" v-if="!$v.form.password.required">The password is required.</span>
                                        <span class="md-error" v-else-if="!$v.form.password.minlength">Minimum length of password should be 6.</span>
                                    </md-field>
                                </div>
                            </div>
                            
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-button :href="null" class="md-primary" :md-ripple=true @click="forgotPasswordModal = true" id="forgotPasswordModal">  Forgot Password</md-button>   
                                </div>
                            </div>
                        </md-card-content>
                        <md-progress-bar md-mode="indeterminate" v-if="sending" />

                        <md-card-actions md-alignment="space-between">
                            <md-button class="md-primary" @click="registerModal = true" id="registerModal"> Register </md-button>
                            <md-button type="submit" class="md-primary" :disabled="sending" id="loginSubmit">Login</md-button>
                        </md-card-actions>
      
                        </md-card>
                    </form>  
               
            </div>    

        <!--Modal for forgot password -->

        <md-dialog :md-active.sync="forgotPasswordModal" v-on:md-closed="clearForgotPasswordForm" >
            <md-dialog-title id="forgotPasswordText"> Forgot Password? We got you! </md-dialog-title>
            <form novalidate class="md-layout-item md-size-100 md-medium-size-100" @submit.prevent="validateForgotPassword">
                <md-dialog-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('forgotPassword')">
                                <label for="forgotPassword" > Email </label>
                                <md-input name="forgotPassword" id="forgotPassword" v-model="form.forgotPassword" :disabled="sending"> </md-input>
                                <span class="md-error" v-if="!$v.form.forgotPassword.required">The email is required.</span>
                                <span class="md-error" v-else-if="!$v.form.forgotPassword.email">Invalid email.</span>
                            </md-field>
                        </div>
                    </div>
                 </md-dialog-content>
             <md-progress-bar md-mode="indeterminate" v-if="sending" />
            <md-dialog-actions >
                <md-button class="md-primary" @click="forgotPasswordModal = false">Close</md-button>
                <md-button type="submit" class="md-primary" :disabled="sending" >Send</md-button>
            </md-dialog-actions>
            </form>
        </md-dialog>

        <!--Modal for material design-->
        <md-dialog :md-active.sync="registerModal" v-on:md-closed="clearRegisterForm" >
            <md-dialog-title> Register </md-dialog-title>
            
            
               <form novalidate class ="md-layout-item md-size-100 md-medium-size-100" @submit.prevent="validateRegisterUser">
                <md-dialog-content>
                    <div class="md-layout md-gutter"> 
                      
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('registerUsername')">
                                <label for="registerUsername" > Username </label>
                                <md-input name="registerUsername" id="registerUsername" v-model="form.registerUsername" :disabled="sending"> </md-input>
                                <span class="md-error" v-if="!$v.form.registerUsername.required">The username is required.</span>
                                <span class="md-error" v-else-if="!$v.form.registerUsername.minlength">Minimum length of username should be 5.</span>
                            </md-field>
                        </div>
                    </div>
                    
               
                    
                    <div class="md-layout md-gutter"> 
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('registerEmail')">
                                <label for="registerEmail" > Email </label>
                                <md-input name="registerEmail" id="registerEmail" v-model="form.registerEmail" :disabled="sending"> </md-input>
                                <span class="md-error" v-if="!$v.form.registerEmail.required">The email is required.</span>
                                <span class="md-error" v-else-if="!$v.form.registerEmail.email">Invalid email.</span>
                            </md-field>
                         
                        </div>
                    </div>

                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('registerPassword')">
                                <label for="registerPassword"> Password </label>
                                <md-input name="registerPassword" type="password" id="registerPassword" v-model="form.registerPassword" :disabled="sending"> </md-input>
                                <span class="md-error" v-if="!$v.form.registerPassword.required">The password is required.</span>
                                <span class="md-error" v-else-if="!$v.form.registerPassword.minlength">Minimum length of password should be 6.</span>
                            </md-field>
                        </div>
                    </div>

                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('registerPasswordConfirm')">
                                <label for="registerPasswordConfirm"> Confirm Password </label>
                                <md-input name="registerPasswordConfirm" type="password" id="registerPasswordConfirm" v-model="form.registerPasswordConfirm" :disabled="sending"> </md-input>
                               
                                <span class="md-error" v-if="!$v.form.registerPasswordConfirm.sameAsPassword">Password and Confirm Password do not match.</span> 
                            </md-field>
                        </div>
                    </div>
                    
               
            </md-dialog-content>
             <md-progress-bar md-mode="indeterminate" v-if="sending" />
            <md-dialog-actions >
                <md-button class="md-primary" @click="registerModal = false">Close</md-button>
                <md-button type="submit" class="md-primary" :disabled="sending" >Save</md-button>
            </md-dialog-actions>
            </form>
        </md-dialog>
    </div>
</template>

<script>
import '../../node_modules/vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {Api} from '../api';
import { validationMixin } from 'vuelidate';
import {sameAs} from 'vuelidate/lib/validators';
import {
    required,
    email,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators'
export default {
    name: 'login',
    mixins: [validationMixin],
    data(){
        return {
            isLoading: false,
            fullPage: true,

            form :{
                email: null,
                password: null,
                registerUsername: null,
                registerEmail: null,
                registerPassword: null,
                registerPasswordConfirm: null,
                forgotPassword: null
            },
            sending : false,
            registerModal: false,
            forgotPasswordModal: false,
            api: new Api()
        }
    },
    validations: {
        form : {
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(6)
            },
            registerUsername :{
                required,
                minLength: minLength(5)
            },
            registerEmail: {
                required,
                email
            },
            registerPassword: {
                required,
                minLength: minLength(6)
            },
            registerPasswordConfirm: {
                sameAsPassword : sameAs('registerPassword')
            },
            forgotPassword: {
                required,
                email
            }
        }
    },
    components: {
            Loading
        },
    methods: {

        clearForgotPasswordForm(){
            this.form.forgotPassword = null;
            this.$v.form.forgotPassword.$reset();
        },
        clearRegisterForm(){
            this.form.registerUsername= null;
            this.form.registerEmail= null;
            this.form.registerPassword= null;
            this.form.registerPasswordConfirm = null;

            this.$v.form.registerUsername.$reset();
            this.$v.form.registerEmail.$reset();
            this.$v.form.registerPasswordConfirm.$reset();
            this.$v.form.registerPassword.$reset();
        },
        validateForgotPassword(){
            this.$v.form.forgotPassword.$touch();
            if(!this.$v.form.forgotPassword.$invalid){
                this.sendPasswordResetEmail();
            }
        },
         validateRegisterUser(){
             this.$v.form.registerUsername.$touch();
             this.$v.form.registerEmail.$touch();
             this.$v.form.registerPassword.$touch();
             this.$v.form.registerPasswordConfirm.$touch();
             if(!this.$v.form.registerUsername.$invalid && !this.$v.form.registerEmail.$invalid && !this.$v.form.registerPassword.$invalid && !this.$v.form.registerPasswordConfirm.$invalid){
                 this.handleRegister();
             }
             else{
                 console.log("form not fixed!");
             }
         },
         validateUser () {
            this.$v.form.email.$touch();
            this.$v.form.password.$touch();

            if (!this.$v.form.email.$invalid && !this.$v.form.password.$invalid) {
                this.handleLogin()
            }
        },
        async sendPasswordResetEmail(){
            const email = this.form.forgotPassword;
            this.forgotPasswordModal = false;
            this.isLoading = true;
            const res = await this.api.postData('/forgotPassword',{email: email});
                this.isLoading = false;
                if(res.data.status == 200){
                    this.$notify({
                        group: 'login',
                        title: 'Email Sent!',
                        type: 'success',
                        text: res.data.message,
                        duration: 10000
                    })
                }
                else{
                    this.$notify({
                        group: 'login',
                        title: 'Email error!',
                        type: 'error',
                        text: res.data.message,
                        duration: 10000
                    })
                }
            
        },
        getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
        async handleLogin()
        {
           
                //this.sending = true;
                this.isLoading = true;
                let api = new Api();
                let res = await api.postData("/authenticate", {email: this.form.email, password: this.form.password});
                
                    //this.sending= false;
                    this.isLoading = false;
                    if(res.data.status == 300)
                    {
                        this.$notify({
                            group: 'login',
                            title: 'Login error!',
                            type: 'error',
                            text: res.data.message,
                            duration: 10000
                        })
                    }
                    else if(res.data.status == 401)
                    {
                        this.$router.push({name: 'login'});
                    }
                    else if( res.data.status == 200)
                    {
                        if(!res.data.isAdmin)
                        {
                            this.$router.push({name: 'home'});
                        }
                        else
                        {
                            this.$router.push({name: 'admin'});
                        }
                    }
                
           
        },
        resetModalRegister()
        {
            this.registerUsername= '';
            this.registerUsernameState = null;
            this.registerEmail = '';
            this.registerEmailState = null;
            this.registerPassword = '';
            this.registerPasswordState = null;
            this.registerPasswordConfirm = '';
            this.registerPasswordConfirmState = null;
        },
        async handleRegister()
        {
            
            this.registerModal = false;
            //this.sending = true;
            this.isLoading = true;
           
            /**
             * send the request to the back end
             */
            let api = new Api();
            
            const res = await api.postData('/register', {registerUsername: this.form.registerUsername, registerEmail: this.form.registerEmail, registerPassword: this.form.registerPassword}); 
            
               //this.sending = false;
               this.isLoading = false;
               if(res.data.status == 200)
                {
                    this.$notify({
                        group: 'register',
                        title: 'Registration Successful!',
                        type: 'success',
                        text: res.data.message,
                        duration: 10000 
                    })
                }
                else if(res.data.status == 300)
                {
                    this.$notify({
                        group: 'register',
                        title: 'Registration Error!',
                        type: 'warn',
                        text: res.data.message,
                        duration: 10000    
                        }) 
                }
           
            // this.$nextTick(() => {
            //     this.$refs.modal.hide()
            // })    
        },
        
        resetModal()
        {
            this.email = ''
            this.emailState = null
        },
        async handleForgotPassword(bvModalEvt)
        {
            // Prevent modal from closing
            bvModalEvt.preventDefault()
            const valid = this.$refs.form1.checkValidity();
            if (!valid) {
                this.invalidFeedback = "Empty email";
                this.emailState = "invalid";
                return;
            }
            else if((/\S+@\S+\.\S+/.test(this.email) == false))
            {
                this.invalidFeedback = "Invalid Email";
                this.emailState = "invalid";
                return;
            }
            this.emailState = 'valid';
            let api = new Api();
            
            const res = await api.postData('/forgotPassword', {email: this.email});
            // Hide the modal manually
            // this.$nextTick(() => {
            //     this.$refs.modal.hide()
            // })
        }
    }

}
</script>
<style scoped>
.md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }

.wrapper {
  position: fixed;
  top: 3%;
  left: 5%;
  right: 5%;
  width: 90%;
  height: auto;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-display: inherit;
}
.login {
  position: fixed;
  top: 8%;
  left: 40%;
  right: 40%;
  height: auto;
  background-color: whitesmoke;
  text-align: center;
  font-size: medium;
}
.login-title{
  font-size: 20px;
  font-size-adjust: none
}
.login-container {
  position: relative;
  background-color: white;
  height: auto;
  top: 50px;
  width: auto;
  padding: 10px;
  font-size:16px;
  border-style: ridge;
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
</style>