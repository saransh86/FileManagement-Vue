<template>
<div>
    <notifications group ="notify" position="top center"/>
    <navBar :key="componentKey"/>
    <div class="index-page">
    <div class="vld-parent">
        <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
    </div>
    
    <b-container class="main-container">
        <b-row align-h="between">
            <b-col cols="auto">
                <h4>
                    <a :href="url">Home</a>
                    <span v-for="(dir) in directoryName" :key="dir.name">
                        <a :href="'/#/' + dir.path"> > {{dir.name}}</a>
                    </span>
                </h4>
            </b-col> 
        </b-row>
        <b-row align-h="start">
            <b-col cols="auto">
                <button class="btn btn-success" id="submitCreateDirectory" type="button"  v-b-modal.createDirectory> Create </button>
            </b-col>
            <b-col cols="auto">
                <button class="btn btn-success" id="submitUploadFile" type="button" @click="$refs.file.click()"> Upload </button>
            </b-col>
            <b-col cols="auto">
                <button class="btn btn-success" id="submitDelete" type="button" :disabled="checkedFiles.length==0 && checkedDirs.length==0" v-on:click="bulkDelete"> Delete</button>
                <input type="file" hidden ref="file" name="file_to_upload" multiple v-on:change="handleFileUpload" v-on:click="resetUpload">
            </b-col>
            <b-col cols="auto">
                <button class="btn btn-success" id="submitMove" type="button" :disabled="checkedFiles.length==0" @click="showMoveFileModal"> Move</button>
            </b-col>
        </b-row>
        <b-row align-h="start">
            <b-col cols="auto">
                <h4> Your directories and files... </h4>
            </b-col>
        </b-row>
    </b-container> 
       
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
                <span class="data" v-on:click="download" :value=file> {{file}}</span>
                
                <!-- <font-awesome-icon icon="trash-alt" class="delete" :name=file size="2x" v-on:click="deleteFile"></font-awesome-icon> -->
            </div>
        </div>
        </div>
    

     <b-modal id='createDirectory' ref="modal" title="Give a creative name to the directory!" @show="resetModal" @hidden="resetModal" @ok="handleCreateDirectory" ok-variant="success" cancel-variant="success">
            <form ref="form" @submit.stop.prevent="handleSubmitForgetPassword">
                
                    <b-container>    
                        <b-row>
                            <b-col cols="2">
                                <font-awesome-icon icon="folder-open" size="2x" class="input-container"></font-awesome-icon>
                            </b-col>
                        <b-col align-self="center" cols="10">
                            <b-form-group :state="dirState"  :invalid-feedback="invalidFeedback" class="input-container"> 
                                <b-form-input id="dirName" v-model="dirName" :state="dirState"  required placeholder="Enter the directory Name." class="input-group-text"> </b-form-input>
                             </b-form-group>
                        </b-col>
                        </b-row>
                    </b-container>
                
            </form>
        </b-modal>

         <b-modal id='moveFileToDirectory' ref="moveModal" title="Move File To Directory" @show="resetModal" @hidden="resetModal" @ok="moveFileToDirectory" ok-variant="success" cancel-variant="success">
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
        </b-modal>
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
export default {
    
  name: "directory",
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
    };
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
               this.$refs['moveModal'].show();
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
        async handleCreateDirectory(bvModalEvt)
        {
            bvModalEvt.preventDefault()
            if(this.diryName == '')
            {
                this.dirState = 'invalid';
                this.invalidFeedback = "Hmm, seems no name provided for the directory?"
                return;
            }
            else if (/^[a-zA-Z0-9- \'\"\(\)_]*$/.test(this.dirName) == false)
            {
                this.dirState = 'invalid';
                this.invalidFeedback = "Hmm, seems your using special characters. Sorry, mind not using it?"
                return;
            }
            else
            {  
                this.dirState = 'valid';
                const name = this.dirName;
                this.isLoading = true;
                let api = new Api();
                const res = await api.postData('/file',{name: this.dirName, path: this.path} );
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
                
                this.$nextTick(() => {
                    this.$refs.modal.hide()
                })
            }
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
a {
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