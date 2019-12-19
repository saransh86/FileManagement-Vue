<template>
<div>
    <notifications group ="notify" position="top center"/>
    <navBar :key="componentKey"/>
    <div class="index-page">
    <div class="vld-parent">
        <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
    </div>
    
    <md-card class="md-layout-item md-size-100 md-small-size-100" >
               <md-card-header>
                   <div class="md-title">
                        <a :href="url">Home</a>
                        <span v-for="(dir) in directoryName" :key="dir.name">
                            <a :href="'/#/' + dir.path"> > {{dir.name}}</a>
                        </span>
                    </div>
               </md-card-header>

               <md-card-content>
                   <div class="md-layout-item md-layout">
                    </div>
                   <div class="md-layout">
                        <md-button id="submitCreateDirectory" class="md-primary md-raised" @click="createDirectoryModal= true"> Create</md-button>
                        <md-button id="submitFileUpload" class="md-primary md-raised" @click="$refs.file.click()"> Upload</md-button>
                        <md-button class="md-primary md-raised" id="submitDelete" :disabled="checkedFiles.length==0 && checkedDirs.length==0" v-on:click="bulkDelete"> Delete</md-button>
                        <md-button class="md-primary md-raised" id="submitMove" :disabled="checkedFiles.length==0" @click="showMoveFileModal"> Move</md-button>
                       <input type="file" hidden ref="file" name="file_to_upload" multiple v-on:change="handleFileUpload" v-on:click="resetUpload">
                   </div>  

                    <div  class="layout">
                        <div :hidden="files.length == 0 && directories.length == 0">
                            <input type="checkbox" class="delete" v-on:click="selectAll" v-model="allSelected">
                        </div>
                        <div v-for="(dir) in directories" :key="dir" >
                            <input type="checkbox" :value=dir v-model="checkedDirs" class="delete" v-on:click="select">
                            <font-awesome-icon icon="folder-open" size="2x"></font-awesome-icon>
                            <a class="data" v-bind:href="url + apath +'/' + dir"> {{dir}}</a>
                        </div>
                        <div v-for="(file) in files" :key="file">
                            <input type="checkbox" :value=file v-model="checkedFiles" class="delete" v-on:click="select">
                            <font-awesome-icon icon="file" size="2x"></font-awesome-icon>
                            <span class="data"  v-on:click="download" :value=file> {{file}}</span>
                
                
                        </div>
                    </div>

               </md-card-content>
           </md-card>
       
       
        </div>

        <!--Modal for create Directory-->

         <md-dialog :md-active.sync="createDirectoryModal" v-on:md-closed="clearCreateDirectoryForm">
            <md-dialog-title> Create Directory </md-dialog-title>
            <form novalidate class="md-layout-item md-size-100 md-medium-size-100" @submit.prevent="validateCreateDirectory">
                <md-dialog-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('dirName')">
                                <label for="dirName" > Directory </label>
                                <md-input name="dirName" id="dirName" v-model="form.dirName"> </md-input>
                                <span class="md-error" v-if="!$v.form.dirName.required">The directory name is required.</span> 
                            </md-field>
                        </div>
                    </div>
                 </md-dialog-content>
            
            <md-dialog-actions >
                <md-button class="md-primary" @click="createDirectoryModal = false">Close</md-button>
                <md-button type="submit" class="md-primary" >Send</md-button>
            </md-dialog-actions>
            </form>
        </md-dialog>
    

         <!-- <b-modal id='moveFileToDirectory' ref="moveModal" title="Move File To Directory" @show="resetModal" @hidden="resetModal" @ok="moveFileToDirectory" ok-variant="success" cancel-variant="success">
        <form ref="form1" @submit.stop.prevent="moveFileToDirectory">
            <b-container>    
                <b-row>
                    <b-col cols="2">
                        <font-awesome-icon icon="folder-open" size="2x" class="input-container"></font-awesome-icon>
                    </b-col>
                    <b-col align-self="center" cols="10">
                        <b-form-group class="input-container"> 
                            <vue-select placeholder="Search Directories" :clearable="false" label="directoryName" v-model="selectedDir" :options="allDirectories" ></vue-select>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>    
        </form>
        </b-modal> -->

        
        <!--Modal for move files-->
         <md-dialog :md-active.sync="moveToModal">
            <md-dialog-title> Move to </md-dialog-title>
            <form novalidate class="md-layout-item md-size-100 md-medium-size-100" @submit.prevent="moveFileToDirectory">
                <md-dialog-content>
                    <div class="md-layout md-gutter md-medium-size-200">
                        <div class="md-layout-item">
                            
                            
                            <vue-select placeholder="Search Directories" :clearable="false" label="directoryName" v-model="selectedDir" :options="allDirectories" ></vue-select>
                             
                        </div>
                    </div>
                 </md-dialog-content>
            
            <md-dialog-actions >
                <md-button class="md-primary" @click="moveToModal = false">Close</md-button>
                <md-button type="submit" class="md-primary" >Move</md-button>
            </md-dialog-actions>
            </form>
        </md-dialog>
  </div>
</template>
<script>
import '../../node_modules/vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {Api} from '../api';
import lodash from 'lodash';
import VueSelect from 'vue-select';
import navBar from './navigationBar';
import 'vue-select/dist/vue-select.css';
import { validationMixin } from 'vuelidate'
import {sameAs} from 'vuelidate/lib/validators';
import {
    required,
    email,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators'
export default {
    
    name: "directory",
    mixins: [validationMixin],
    async beforeRouteEnter(to, from, next){
      /**
       * check to see if the directory exists
       */
        // if(from.name != "myProfile")
        // {
            
            const basePath = "root/home";
            let dirs = to.path.split(/\//);
            let toPaths = [];
            let path;
            if(dirs.length >2)
            {
                toPaths = to.path.split(/\//);
                toPaths.pop();
                path = basePath + toPaths.join('/');  
            }
            else
            {
                path = basePath;
            }
            let api = new Api();
            const res = await api.getData('/file/is_directory',{path: path, directory: dirs[dirs.length - 1]});
            console.log("Path",path);
            console.log("Directory",dirs[dirs.length - 1]);
            console.log("Response", res.data.message);
            console.log("Status", res.data.status);
            if(res.data.status == 200)
            {
                next();
            }
            else
            {
                next({name: 'home'});
            }
        // }   
        // else
        // {   
        //     console.log("Going to", to.path);
        //     next({name: 'home'});
        // }
    },
async beforeRouteUpdate(to, from, next) {
    
    const basePath = "root/home";
        let dirs = to.path.split(/\//);
        let toPaths = [];
        let path;
        if(dirs.length >2)
        {
            toPaths = to.path.split(/\//);
            toPaths.pop();
            path = basePath + toPaths.join('/');  
        }
        else
        {
            path = basePath;
        }
        let api = new Api();
        const res = await api.getData('/file/is_directory',{path: path, directory: dirs[dirs.length - 1]});
        console.log("Update Path",path);
        console.log("Directory",dirs[dirs.length - 1]);
        console.log("Response", res.data.message);
        console.log("Status", res.data.status);
        if(res.data.status == 200)
        {
            next();
        }
        else
        {
             next({name: 'home'});
        }
},
  data() {
    return {
        directoryName: [],
        path: '',
        apath: '',
        url: "http://localhost:8080/#/",

        directories: [],
        files:[],
        selected :null,
        selectedDir : null,
        allFiles: [],
        allDirectories: [],

        dirName : '',
        dirState: null,
        invalidFeedback: '',

        checkedFiles: [],
        checkedDirs: [],
        allSelected : false,
        isLoading: false,
        fullPage: true,
        componentKey: 0,
        form: {
            dirName: null
        },
        createDirectoryModal: false,
        moveToModal: false,
    };
  },
  
    validations: {
        form: {
            dirName:{
                required
            }
        }
    },
  components: {
        Loading,
        VueSelect,
        navBar
    },
  async mounted() {
    
    this.init()
        //})
   
  },
  methods:{
      
        getValidationClass (fieldName) {
            const field = this.$v.form[fieldName]

            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }   
        },
        clearCreateDirectoryForm(){
            this.form.dirName = null;
            this.$v.form.dirName.$reset();
        },
        validateCreateDirectory(){
            this.$v.form.dirName.$touch();
            if(!this.$v.form.dirName.$invalid){
                this.handleCreateDirectory();
            }
        },
        async forceUpdate(){
            this.componentKey += 1;
        },
        async init(){
            let directory = window.location.href.split("/");
            directory.splice(0, 4);
    
            let prev = "";
            let res = [];

            for (var i = 0; i < directory.length; i++) {
                if(directory[i].length == 0)
                {
                    continue;
                } 
                let dir = { name: "", path: "" };
                if (prev == "") {
                    dir.path = directory[i];
                    prev = directory[i];
                } else {
                    dir.path = prev + "/" + directory[i];
                    prev = prev + "/" + directory[i];
                }
                dir.name = unescape(directory[i]);
                res.push(dir);
            }
            this.directoryName = res;
            this.apath = res[res.length - 1].path;
            this.path = "root/home/" + res[res.length - 1].path;
            let api = new Api();
            // const result = await api.getData('/home/welcome', {path: this.path});
            const welcomePromise =  api.getData('/home/welcome',  {path: this.path})
            //const allFilesPromise = api.getData('/user/get_files',{});
            const allDirectoriesPromise = api.getData('/user/get_directories', {});
            const [result, allDirectories] = await Promise.all([welcomePromise, allDirectoriesPromise]);
   
            if(result.data.status == 200  && allDirectories.data.status==200)
            {
                console.log("Got the data", res);
                
                this.directories = result.data.data.directories;
                this.files = result.data.data.files;
                this.allDirectories = allDirectories.data.data;
            }
            else if(result.data.status == 401 || allDirectories.data.status == 401)
            {
                this.$router.push({name: 'login'});
            }
            else
            {
                console.log("oops! Error!", result);
                this.$notify({
                group: 'notify',
                title: 'Cannot load files and directories at this time.',
                type: 'error',
                text: "Uh ho. Something not right. Mind relogging?",
                duration: 10000
                })
            } 
        },
        async moveFileToDirectory()
        {
            let api = new Api();
            this.isLoading = true;
            this.moveToModal = false;
            // console.log("Directory Selected ", this.selectedDir);
            // console.log("Files ", this.files);
            const path = this.selectedDir.path + '/' + this.selectedDir.directoryName;
            // console.log("New PAth", path);
            const res = await api.putData('/user/move_files',{files: this.checkedFiles, path: path});
            this.isLoading = false;
            if(res.data.status == 200){
                this.files = this.files.filter(x => !this.checkedFiles.includes(x));
                this.$notify({
                            group: 'notify',
                            title: 'Move Successful!',
                            type: 'success',
                            text: res.data.message,
                            duration: 10000
                        })
            }
            else if(res.data.status == 401){
                this.$router.push({name: 'login'});
            }
            else{
                this.$notify({
                    group: 'notify',
                    title: 'Uh ho! Something wrong!',
                    type: 'error',
                    text: res.data.message,
                    duration: 10000
                })
            }
            
        },
        async showMoveFileModal(){
           let api = new Api(); 
           this.isLoading = true;
           const res = await api.getData('/user/get_directories', {});
           this.isLoading = false;
           if(res.data.status == 200){
               this.allDirectories = res.data.data;
               //    this.$refs['moveModal'].show();
                this.moveToModal = true;
           } 
           else if(res.data.status == 401){
               this.$router.push({name: 'login'});
           }
           else{
                this.$notify({
                    group: 'notify',
                    title: 'Cannot load directores at this time.',
                    type: 'error',
                    text: "Uh ho. Something not right. Mind relogging?",
                    duration: 10000
                })
           }
        },
        resetUpload()
        {
           this.$refs.file.value = '';
        },
        resetModal()
        {
            this.dirName = ''
            this.dirState = null
        },
        async handleFileUpload(e)
        {
            let files = e.target.files || e.dataTransfer.files;
            let filesToUpload = [];
            let data = new FormData();
            this.isLoading = true;
            setTimeout(async() => {
                this.isLoading = false;
                filesToUpload = lodash.filter(files, function(file){
                    if(this.files.indexOf(file.name) == -1)
                    {
                        data.append("file_to_upload", file);
                        console.log("In filter",file.name);
                        return file.name;
                    }
                }.bind(this));
              
                data.append('path', this.path)
                if(filesToUpload.length == 0)
                {
                    this.$notify({
                    group: 'notify',
                    title: 'Upload existing files',
                    type: 'warn',
                    text: "Hmm, seems the files you selected are already uploaded" ,
                    duration: 10000
                    })  
                }
                else
                {
                    let api = new Api();
                    const res = await api.postData('/file/upload', data);
                    console.log("Uploaded", filesToUpload.length);
                    console.log("Selected", files.length);
                    if(res.data.status == 200)
                    {
                        let currentpath = this.path.split(/\//);
                        currentpath.splice(0,2);
                        
                        for(let i=0; i<filesToUpload.length; i++)
                        {
                            console.log("pushing in the file");
                            this.files.push(filesToUpload[i].name); 
                            let obj = {fileName: '', path: ''};
                            obj.fileName = filesToUpload[i].name;
                            obj.path = "/#/" + currentpath.join('/');
                            this.allFiles.push(obj);
                        }
                        this.$notify({
                            group: 'notify',
                            title: 'Upload Success!',
                            type: 'success',
                            text: "You. The. Man.",
                            duration: 10000
                        })
                        if(filesToUpload.length != files.length)
                        {
                            this.$notify({
                            group: 'notify',
                            title: 'Upload existing files',
                            type: 'warn',
                            text: "Um, some of the files you selected are already uploaded",
                            duration: 10000
                            })
                        } 
                    }
                    else if(res.data.status == 401)
                    {
                        this.$router.push({name: 'login'});
                    }
                    else
                    {
                        this.$notify({
                            group: 'notify',
                            title: 'Cannot confirm the upload.',
                            type: 'error',
                            text: "Uh ho. Something not right.",
                            duration: 10000
                        })
                    }
                 
                }
                await this.forceUpdate();
             }, 1000);
        },
        async handleCreateDirectory()
        {
            
                const name = this.form.dirName;
                this.isLoading = true;
                let api = new Api();
                this.createDirectoryModal = false;
                const res = await api.postData('/file',{name: this.form.dirName, path: this.path} );
                setTimeout(() => {
                    this.isLoading = false;
                    if(res.data.status==200)
                    {
                        this.directories.push(name);
                        
                        this.$notify({
                            group: 'notify',
                            title: 'Directory Created!',
                            type: 'success',
                            text: "Whos the man! You the man!",
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
                            title: 'Something not right',
                            type: 'err',
                            text: "Apologies, this is not normal.",
                            duration: 10000
                        }) 
                    }
                }, 1000);
                
        },
        async bulkDelete()
        {
            let api = new Api();
            this.isLoading = true;
            setTimeout(async() => {
                this.isLoading = false;
                if(this.checkedFiles.length > 0 && this.checkedDirs.length> 0)
                {
                    console.log("Click for files and dirs");
                    console.log("FILES", this.checkedFiles);
                    console.log("Directory", this.checkedDirs);
                    const resFiles =  api.deleteFile('/file/delete', {name: this.checkedFiles, path: this.path});
                    const resDirs =  api.deleteFile('/file/delete_dir', {directoryName: this.checkedDirs, path: this.path});
               
                    const res = await Promise.all([resFiles, resDirs]); 
                
                    if(res[0].data.status == 200 && res[1].data.status == 200)
                    {
                        // this.directories = this.directories.filter(x => !this.checkedDirs.includes(x));
                        // this.files = this.files.filter(x => !this.checkedFiles.includes(x));
                        // this.allFiles = this.allFiles.filter(x => !this.allFiles.includes(x));
                        await this.init();
                        this.$notify({
                            group: 'notify',
                            title: 'Delete Successful for Files and Directories!',
                            type: 'success',
                            text: "Feeling light!",
                            duration: 10000
                        })   
                    }
                    else if(res[0].data.status == 401 || res[1].data.status == 401)
                    {
                        this.$router.push({name: 'login'});
                    }
                    else if(res[0].data.status == 300 || res[1].data.status == 300)
                    {
                        console.log("uh ho! Cannot confirm the delete!");
                        this.$notify({
                            group: 'notify',
                            title: 'Delete Failed. Dammit!',
                            type: 'error',
                            text: "Uh. Em. ok, yeah this suck.",
                            duration: 10000
                        })
                    }
                    this.checkedFiles = [];
                    this.checkedDirs = [];
                }
                else if(this.checkedDirs.length > 0 && this.checkedFiles.length == 0)
                {
                    console.log("Click just for dirs");
                    console.log("FILES", this.checkedFiles);
                    console.log("Directory", this.checkedDirs);
                //let api = new Api();
                    const res = await api.deleteFile('/file/delete_dir', {directoryName: this.checkedDirs, path: this.path})
                    console.log(res);
                    if(res.data.status == 200)
                    {
                        // this.directories = this.directories.filter(x => !this.checkedDirs.includes(x));
                        await this.init();
                        this.$notify({
                            group: 'notify',
                            title: 'Directory Delete Success!',
                            type: 'success',
                            text: "Feeling light!",
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
                            title: 'Delete Directory Failed. Dammit!',
                            type: 'error',
                            text: "Uh. Em. ok, yeah this suck.",
                            duration: 10000
                        })
                    }
                    this.checkedDirs = [];
                }
                else if(this.checkedFiles.length > 0 && this.checkedDirs.length == 0)
                {
                    const res = await api.deleteFile('/file/delete', {name: this.checkedFiles, path: this.path});
                    console.log("Click just for files");
                    console.log("FILES", this.checkedFiles);
                    console.log("Directory", this.checkedDirs);
                    if(res.data.status == 200)
                    {
                        // this.files = this.files.filter(x => !this.checkedFiles.includes(x));
                        // this.allFiles = this.allFiles.filter(x => !this.allFiles.includes(x));
                        await this.init();
                        this.$notify({
                            group: 'notify',
                            title: 'File Delete Success!',
                            type: 'success',
                            text: "Feeling light!",
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
                            title: 'File Directory Failed. Dammit!',
                            type: 'error',
                            text: "Uh. Em. ok, yeah this suck.",
                            duration: 10000
                        })
                    }
                    this.checkedFiles = [];
                }
                await this.forceUpdate();
            }, 1000);
            
            this.allSelected = false;
            //})

        },
        async download(e)
        {
            const file = e.currentTarget.getAttribute('value');
            let api = new Api();
            const res = await api.getData('/file/download',{file: file, path: this.path},'blob');
            if(res.data.status == 401)
            {
                this.$router.push({name: 'login'});
            }
            else if(res.data.status == 300)
            {
                 this.$notify({
                    group: 'notify',
                    title: 'Mind Refreshing?',
                    type: 'error',
                    text: res.data.message,
                    duration: 10000
                })
            }
            else
            {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file);
                document.body.appendChild(link);
                link.click();
            }
           //})
        },
        selectAll()
        {
            console.log("ALL SELECTED", this.allSelected);
            this.checkedFiles = [];
            this.checkedDirs = []
            if(!this.allSelected)
            {
                for(var i =0; i<this.files.length; i++)
                {
                    this.checkedFiles.push(this.files[i]);
                }
                for(var j=0; j< this.directories.length; j++)
                {
                    this.checkedDirs.push(this.directories[j]);
                }
            }
            else{
                this.checkedFiles = [];
                this.checkedDirs = [];
            }
        },
        select()
        {
            this.allSelected = false;
        }
    }
};
</script>
<style scoped>
.md-dialog-content
{
    overflow:  inherit;
}
.md-dialog
{
    overflow: visible;
}
.index-page{
  position:fixed;
  right: 100px;
  top: 60px;
  left:100px;
  padding: 20px;
  background-color: white;
  /* overflow:auto; */
  
}
.delete{
    position: inherit;
    margin-right: 10px;
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
h4{
    margin-top: 20px;
}
.data
{
    font-size: 22px;
    
    border-top: none !important;
    white-space: nowrap;
    
}
.md-theme-default a:not(.md-button) {
  text-decoration: none;
  color: black;
}
.dropdown-text {
  padding: 5px;
  text-align: center;
}
.main-container{
    padding-right: 0px;
    padding-left: 0px;
    margin-right: 0px;
    margin-left: 0px;
}
.searchBar{
    width: 300px;
    background: white;
    margin-right: 10px;
}
.navbar-brand{
    margin-left: 106px;
}
</style>