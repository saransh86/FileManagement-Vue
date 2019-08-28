<template>

    <div class="wrapper" >
        <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <font-awesome-icon icon="file" size="lg"/> 
            <div class='login'>
                <span class='login-title'>
                    File Management
                </span>
                <notifications group ="register" position="top center"/>
                <notifications group ="login" position="top center"/>
                <div class='login-container'>
                    <div class='input-container'>
                        <input type="username" id="username" v-model="username" name="username" class="input-group-text col-11" placeholder="Username" required>
                    </div>
                    <div class="input-container">
                        <input type="password" id="password" v-model="password" name="password"  class="input-group-text col-11" placeholder="Password" required>
                    </div>
                    <div class="input-container">
                        <a id='forgotPassword' href='#' v-b-modal.forgetPassword>Forgot Password? </a>
                        
                    </div>
                    <div class="input-container">
                        <button id="submitLogin" type="button" v-on:click="handleLogin" class="btn btn-primary btn col-11"> Login </button>
                    </div>
                    <div class="input-container">
                        <span>Not Registered ? </span>
                        <a id="register" href='#' v-b-modal.registerModal> Create an account </a>
                    </div>
                </div>
               
            </div>    
       
            
       

        <b-modal id='registerModal' ref="modal" title="Register For Awesomeness!" @show="resetModalRegister" @hidden="resetModalRegister" @ok="handleRegister">
            <form ref="form" @submit.stop.prevent="handleRegister">
                
                    <b-container>
                       
                            
                            <b-row>
                                <b-col cols="2">
                                    <font-awesome-icon icon="user" size="2x" class="input-container"></font-awesome-icon>
                                </b-col>
                                <b-col align-self="center" cols="10">
                                     <b-form-group :state="registerUsernameState" :invalid-feedback="invalidFeedbackUsername" class="input-container">
                                        <b-form-input id="registerUsername" v-model="registerUsername" :state="registerUsernameState" required placeholder="Username" class="input-group-text col-11"> </b-form-input>
                                     </b-form-group>
                                </b-col>
                            </b-row>
                       
                    <!-- </b-container>
                    
                <b-container>      -->
                            <b-row>
                                <b-col cols="2">
                                    <font-awesome-icon icon="envelope" size="2x" class="input-container"></font-awesome-icon>
                                </b-col>
                                <b-col align-self="center" cols="10">
                                    <b-form-group :state="registerEmailState" :invalid-feedback="invalidFeedbackEmail" class="input-container">
                                        <b-form-input id="registerEmail" v-model="registerEmail" :state="registerEmailState" required placeholder="Email" class="input-group-text col-11"> </b-form-input>
                                     </b-form-group>
                                </b-col>
                            </b-row>
                       
                <!-- </b-container>

                <b-container>  -->
                            <b-row>
                                <b-col cols="2">
                                    <font-awesome-icon icon="key" size="2x" class="input-container"></font-awesome-icon>
                                </b-col>
                                <b-col align-self="center" cols="10">
                                    <b-form-group :state="registerPasswordState" :invalid-feedback="invalidFeedbackPassword" class="input-container">
                                        <b-form-input id="registerPassword" type="password" v-model="registerPassword" :state="registerPasswordState" required placeholder="Password" class="input-group-text col-11"> </b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        
                <!-- </b-container>
                

                <b-container>   -->
                            <b-row>
                                <b-col cols="2">
                                    <font-awesome-icon icon="key" size="2x" class="input-container"></font-awesome-icon>
                                </b-col>
                                <b-col align-self="center" cols="10">
                                    <b-form-group :state="registerPasswordConfirmState" :invalid-feedback="invalidFeedbackConfirmPassword" class="input-container">
                                        <b-form-input id="registerPasswordConfirm" type="password" v-model="registerPasswordConfirm" :state="registerPasswordConfirmState" required placeholder="Confirm Password" class="input-group-text col-11"> </b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        
                </b-container>
            </form>
        </b-modal>

         <b-modal id='forgetPassword' ref="modal1" title="Forgot your Password? We got you!" @show="resetModal" @hidden="resetModal" @ok="handleForgotPassword">
            <form ref="form1" @submit.stop.prevent="handleSubmitForgetPassword">
                
                    <b-container>    
                        <b-row>
                            <b-col cols="2">
                                <font-awesome-icon icon="envelope" size="2x" class="input-container"></font-awesome-icon>
                            </b-col>
                        <b-col align-self="center" cols="10">
                            <b-form-group :state="emailState"  :invalid-feedback="invalidFeedback" class="input-container"> 
                                <b-form-input id="email-input" v-model="email" :state="emailState"  required placeholder="Your Email?" class="input-group-text"> </b-form-input>
                             </b-form-group>
                        </b-col>
                        </b-row>
                    </b-container>
                
            </form>
        </b-modal>
    </div>
</template>

<script>
import '../../node_modules/vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {Api} from '../api';
export default {
    name: 'login',
   
    data(){
        return {

            username: '',
            password: '',

            email: '',
            emailState: null,
            invalidFeedback : '',

            registerUsername: '',
            registerUsernameState: null,
            invalidFeedbackUsername: '',

            registerEmail: '',
            registerEmailState:null,
            invalidFeedbackEmail : '',

            registerPassword: '',
            registerPasswordState: null,
            invalidFeedbackPassword: '',
           
            registerPasswordConfirm: '',
            registerPasswordConfirmState: null,
            invalidFeedbackConfirmPassword: '',

            isLoading: false,
            fullPage: true
        }
    },
    components: {
            Loading
        },
    methods: {
        async handleLogin()
        {
            if(this.username == '' || this.password =='')
            {
                console.log("\n Im  in the if block!");
                this.$notify({
                        group: 'login',
                        title: 'Login error!',
                        type: 'error',
                        text: "Empty Username or Password!",
                        duration: 10000      
                })
                return;
            }
            else
            {
                this.isLoading = true;
                let api = new Api();
                let res = await api.postData("/authenticate", {username: this.username, password: this.password});
                setTimeout(() => {
                    this.isLoading = false;
                    console.log(res);
                    if(res.data.status == 300)
                    {
                        console.log("Notify Error!");
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
                        this.$router.push({name: 'home'});
                    }
                }, 2000); 
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
        async handleRegister(bvModalEvt)
        {
            bvModalEvt.preventDefault();
            let check = false;
            if(this.registerUsername =='' || this.registerUsername.length <=4)
            {
                this.registerUsernameState = 'invalid';
                if(this.registerUsername == '')
                {
                    this.invalidFeedbackUsername = "Empty Username.";
                }
                else
                {
                    this.invalidFeedbackUsername = "Almost there! Need username to be more that 4."
                }
                check = true;
            }
            else{
                this.registerUsernameState = 'valid';
            }
            if(this.registerEmail == '' || (/\S+@\S+\.\S+/.test(this.registerEmail) == false))
            {
                this.registerEmailState = 'invalid';
                if(this.registerEmail == '')
                {
                    this.invalidFeedbackEmail = 'Empty Email.';
                }
                else
                {
                    this.invalidFeedbackEmail = 'Emails does not seem to be valid.';
                }
                check = true;
            }
            else{
                this.registerEmailState = 'valid';
            }
            if(this.registerPassword == '' && this.registerPasswordConfirm == '')
            {
                this.registerPasswordState = 'invalid';
                this.invalidFeedbackPassword = 'Empty Password.';
                this.registerPasswordConfirmState = 'invalid';
                this.invalidFeedbackConfirmPassword = 'Empty Confirm Password.';
                check = true;
            }
            else if(this.registerPassword != this.registerPasswordConfirm)
            {
                this.registerPasswordState = 'invalid';
                this.registerPasswordConfirmState = 'invalid';
                this.invalidFeedbackPassword = "Password and Confirm Password don't match.";
                this.invalidFeedbackConfirmPassword = "Password and Confirm Password don't match";
                check = true;
            }
            else
            {
                this.registerPasswordState = 'valid';
                this.registerPasswordConfirmState = 'valid';
            }
            if(check)
            {
                return;
            }
            this.isLoading = true;
            this.registerPasswordState = 'valid';
            this.registerEmailState = 'valid';
            this.registerPasswordState = 'valid';
            this.registerPasswordConfirmState = 'valid';
            /**
             * send the request to the back end
             */
            let api = new Api();
            
            const res = await api.postData('/register', {registerUsername: this.registerUsername, registerEmail: this.registerEmail, registerPassword: this.registerPassword}); 
            setTimeout(() => {
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
            }, 2000);
            this.$nextTick(() => {
                this.$refs.modal.hide()
            })    
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
            this.$nextTick(() => {
                this.$refs.modal.hide()
            })
        }
    }

}
</script>
<style scoped>

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