<template>
    <div>
        <div class="user-page">
            <div class="vld-parent">
                <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
            </div>
            <div class="user-profile">
                <form novalidate class="md-layout-item" @submit.prevent="validateProfile">
                    <md-card class="md-layout-item md-size-100 md-small-size-100" >
                        <md-card-header>
                            <div class="md-title">File Management Reset Password</div>
                        </md-card-header>
               
                        <md-card-content>
                            <div class="md-layout-item md-size-25">
                                <md-field :class="getValidationClass('password')">
                                    <label for="password" > New Password </label>
                                    <md-input name="password" type="password" id="password" v-model="form.password" :disabled="sending"> </md-input>
                                    <span class="md-error" v-if="!$v.form.password.required">The new password is required.</span>
                                    <span class="md-error" v-else-if="!$v.form.password.minLength">Minimum password length should be 6.</span>
                                </md-field>
                            </div>

                            <div class="md-layout-item md-size-25">
                                <md-field :class="getValidationClass('verifyPassword')">
                                    <label for="verifyPassword" > Confirm Password </label>
                                    <md-input name="verifyPassword" type="password" id="verifyPassword" v-model="form.verifyPassword" :disabled="sending"> </md-input>
                                    <span class="md-error" v-if="!$v.form.verifyPassword.sameAsPassword">Password and Confirm Password do not match.</span> 
                                </md-field>
                            </div>

                            <div class="md-layout-item md-size-25">
                                <md-button id="changePassword" type="submit" class="md-layout-item md-primary md-raised md-size-100">Change Password</md-button>
                            </div>
                       
                        </md-card-content>
                    </md-card>  
                </form>
            </div>
        </div>
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
    name: 'resetPassword',
    mixins: [validationMixin],
    components: {
        Loading
    },
    data(){
        return {
            form: {
                password: null,
                verifyPassword: null
            },
            sending: false,
            api : new Api(),
            fullPage: true,
            isLoading: false
        }
    },
    validations: {
        form:{
            password:{
                required,
                 minLength: minLength(6)
            },
            verifyPassword :{
                required,
                sameAsPassword : sameAs('password')
            }
        }
    },
    async mounted(){

    },
    methods: {
        getValidationClass (fieldName) {
            const field = this.$v.form[fieldName]

            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        validateProfile(){
            this.$v.form.password.$touch();
            this.$v.form.verifyPassword.$touch();
            
            if((!this.$v.form.password.$invalid && !this.$v.form.verifyPassword.$invalid)){
                this.changePassword();
            }
        },
        async changePassword(){
            console.log("Change password");
        }
    },


}
</script>

<style scoped>
.user-page{
  position: fixed;;
  right: 100px;
  top: 40px;
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
</style>