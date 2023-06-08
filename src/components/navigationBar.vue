<template>
    <div class="page-container">
        <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <md-app>
            <md-app-toolbar class="md-primary "> 
                <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
                    <font-awesome-icon icon="bars"></font-awesome-icon>
                </md-button>
                <h3 class="md-title md-layout-item" style="flex :1"> My_Files</h3>
                <div class="md-toolbar-section-end">
                    <div class="md-layout-item">
                        <div >
                            <vue-select :key="componentkey" placeholder="Search My Files" @input="setSelected" :clearable="false" label="fileName" v-model="selected" :options="this.allFiles" ></vue-select>
                        </div>
                    </div>
                    <userOptions/>
                </div>
            </md-app-toolbar>
            <md-app-drawer  :md-active.sync="menuVisible" md-persistent="mini" v-bind:style="styleObj">
                <md-toolbar class="md-transparent" md-elevation="0">
                    <span>Welcome {{username}}</span>

                    <div class="md-toolbar-section-end">
                        <md-button class="md-icon-button md-dense" @click="toggleMenu">
                            <font-awesome-icon icon="angle-left"></font-awesome-icon>
                        </md-button>
                    </div>
                </md-toolbar>

                <md-list>
                    <md-list-item class= "pointer" id="submitCreateDirectory" @click="createDirectoryModal= true">
                        <md-icon >
                            <font-awesome-icon icon="folder-open"></font-awesome-icon>
                            <md-tooltip md-direction="right">Create Directory</md-tooltip>
                        </md-icon>
                        <span class="md-list-item-text">Create</span>
                    </md-list-item>

                    <md-list-item class= "pointer" id="submitFileUpload" @click="$refs.file.click()">
                        <md-icon>
                            <font-awesome-icon icon="upload"> </font-awesome-icon>
                            <md-tooltip md-direction="right">Upload Files</md-tooltip>
                        </md-icon>
                        <span class="md-list-item-text pointer">Upload</span>
                        <input type="file" hidden ref="file" name="file_to_upload" multiple v-on:change="handleFileUpload" v-on:click="resetUpload">
                    </md-list-item>

                    <md-list-item class="pointer" @click="bulkDelete" :disabled="checkedFiles.length==0 && checkedDirs.length==0" id="submitDelete">
                        <md-icon :disabled="checkedFiles.length==0 && checkedDirs.length==0">
                            <font-awesome-icon icon="trash-alt"> </font-awesome-icon>
                            <md-tooltip md-direction="right">Delete</md-tooltip>
                        </md-icon>
                        <span class="md-list-item-text pointer">Delete</span>
                    </md-list-item>
                    
                    <md-list-item class="pointer" @click="download" :disabled="checkedFiles.length==0" id="submitDownload">
                        <md-icon :disabled="checkedFiles.length==0">
                            <font-awesome-icon icon="download"> </font-awesome-icon>
                            <md-tooltip md-direction="right">Download</md-tooltip>
                        </md-icon>
                        <span class="md-list-item-text pointer">Download</span>
                    </md-list-item>

                    <md-list-item class="pointer" id="submitMove" :disabled="checkedFiles.length==0" @click="showMoveFileModal">
                        <md-icon :disabled="checkedFiles.length==0">
                            <font-awesome-icon icon="people-carry"> </font-awesome-icon>
                            <md-tooltip md-direction="right">Move</md-tooltip>
                        </md-icon>
                        <span class="md-list-item-text pointer">Move</span>
                    </md-list-item>
                    <md-list-item class="pointer" id="submitShare" :disabled="checkedFiles.length==0" @click="showShareFileModal">
                        <md-icon :disabled="checkedFiles.length==0">
                            <font-awesome-icon icon="share"> </font-awesome-icon>
                            <md-tooltip md-direction="right">Share</md-tooltip>
                        </md-icon>
                        <span class="md-list-item-text pointer">Share</span>
                    </md-list-item>
                </md-list>
            </md-app-drawer>

            <md-app-content>
                <md-tabs :hidden="userData.directoryName.length > 0" md-sync-route>
                    <template slot="md-tab" slot-scope="{ tab }">
                        {{ tab.label }} <i class="badge" v-if="tab.data.badge">{{ tab.data.badge }}</i>
                    </template>
                    <md-tab id="tab-home" md-label="Home" to="/" md-alignment="center" exact />
                    <md-tab id="tab-share" md-label="Shared With Me" @click="clickSharedTab" md-alignment="center" :md-template-data="{badge: sharedFiles}"/>
                </md-tabs>  
                <div>
                    <md-list  class="md-size-5">
                        <md-list-item :hidden="userData.directoryName.length == 0" class="md-size-15">
                            <div >
                                <a :href="url">Home</a>
                                <span v-for="(dir) in userData.directoryName" :key="dir.name">
                                    <a :href="'/#/' + dir.path"> > {{dir.name}}</a>
                                </span>
                            </div>
                        </md-list-item>
                        <md-list-item>
                            <div :hidden="this.files.length == 0 && this.directories.length == 0">
                                <md-checkbox class="md-primary" @change="selectAll" v-model="allSelected" />
                            </div>
                        </md-list-item>
                        <draggable  class="list-group" :list="this.directories" ghost-class="ghost" group="people" @change="dragUpdate" >
                            <div v-for="(dir) in this.directories" :key="dir">
                                <md-list-item class="pointer">
                                    <md-checkbox :value="dir" v-model="checkedDirs" class="md-primary" @change="select"/>
                                    <md-icon> 
                                        <font-awesome-icon icon="folder-open" ></font-awesome-icon>
                                    </md-icon>
                                    <a class="md-list-item-text space" v-if="userData.apath === ''" v-bind:href="url + dir">{{dir}}</a>  
                                    <a class="md-list-item-text space" v-else v-bind:href="url + userData.apath +'/' + dir"> {{dir}}</a>          
                                </md-list-item>
                                
                            </div>
                        </draggable>
                        <draggable  class="list-group" :list="this.files" ghost-class="ghost" group="people" > 
                            <div v-for="(file) in this.files" :key="file" style="cursor:grab">
                                <md-list-item >
                                    <md-checkbox :value="file" v-model="checkedFiles" class="md-primary" @change="select"/>
                                    <md-icon>
                                        <font-awesome-icon icon="file"></font-awesome-icon>
                                    </md-icon>
                                    <span class="md-list-item-text space" :value="file">{{file}}</span>     
                                </md-list-item>
                            </div>
                        </draggable>
                    </md-list>  
                </div>
            </md-app-content>
        </md-app>


        <!--Modal for create Directory-->

        <md-dialog :md-active.sync="createDirectoryModal" v-on:md-closed="clearCreateDirectoryForm" @md-opened="hideDrawer" @md-closed="showDrawer">
            <md-dialog-title>Create Directory</md-dialog-title>
            <form novalidate class="md-layout-item md-size-100 md-medium-size-100" @submit.prevent="validateCreateDirectory">
                <md-dialog-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('directoryName')">
                                <label for="directoryName">Directory</label>
                                <md-input name="directoryName" id="directoryName" v-model="form.directoryName"></md-input>
                                <span class="md-error" v-if="!$v.form.directoryName.required">The directory name is required.</span>
                            </md-field>
                        </div>
                    </div>
                </md-dialog-content>

                <md-dialog-actions>
                    <md-button class="md-primary" @click="createDirectoryModal = false">Close</md-button>
                    <md-button type="submit" class="md-primary" id="createDirectorySubmit">Create</md-button>
                </md-dialog-actions>
            </form>
        </md-dialog>

        <!--Modal for move files-->
        <md-dialog :md-active.sync="moveToModal" @md-opened="hideDrawer" @md-closed="showDrawer">
            <md-dialog-title>Move to</md-dialog-title>
            <form novalidate class="md-layout-item md-size-100" @submit.prevent="moveFileToDirectory">
                <md-dialog-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item">
                            <vue-select placeholder="Search Directories" :clearable="false" label="directoryName" v-model="selectedDir" :options="this.allDirectories"></vue-select>
                        </div>
                    </div>
                </md-dialog-content>
                <md-dialog-actions>
                    <md-button class="md-primary" @click="moveToModal = false">Close</md-button>
                    <md-button type="submit" class="md-primary">Move</md-button>
                </md-dialog-actions>
            </form>
        </md-dialog>

        <!--Modal for share files-->
        <md-dialog :md-active.sync="shareToModal" v-on:md-closed="clearShareWithModal" @md-opened="hideDrawer" @md-closed="showDrawer">
            <md-dialog-title>Share File With</md-dialog-title>
            <form novalidate class="md-layout-item md-size-100" @submit.prevent="shareFileWith">
                <md-dialog-content >
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('shareWithEmail')">
                                <label for="shareWithEmail">Email</label>
                                <md-input name="shareWithEmail" id="shareWithEmail" v-model="form.shareWithEmail"></md-input>
                                <span class="md-error" v-if="!$v.form.shareWithEmail.required">The email is required.</span>
                                <span class="md-error" v-else-if="!$v.form.shareWithEmail.email">Invalid email.</span>
                            </md-field>
                        </div>
                    </div>
                </md-dialog-content>
                <md-dialog-actions>
                    <md-button class="md-primary" @click="shareToModal = false">Close</md-button>
                    <md-button type="submit" class="md-primary">Share</md-button>
                </md-dialog-actions>
            </form>
        </md-dialog>
    </div>
</template>

<script>
import "../../node_modules/vue-loading-overlay/dist/vue-loading.css";
import draggable from 'vuedraggable'
import Loading from "vue-loading-overlay";
import {Api} from '../api';
import VueSelect from 'vue-select';
import lodash from "lodash";
import userOptions from './userProfileOptions';
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
export default {
    name: 'nav',
    mixins: [validationMixin],
    
    data() {
        return {
            url: Api.getUrl() + "/#/",
            selected :null,
            // menuVisible: false,
            selectedDir: null,
            checkedFiles: [],
            checkedDirs: [],
            allSelected: false,
            isLoading: false,
            fullPage: true,
            componentkey: 0,
            form: {
                directoryName: null,
                shareWithEmail: null
            },
            createDirectoryModal: false,
            moveToModal: false,
            shareToModal: false,
            api: new Api(),
            styleObj:{
                zIndex: null
            },
            userData: this.user,
            sharedFiles: 0
        }
    },
    validations: {
        form: {
            directoryName: {
                required
            },
            shareWithEmail: {
                required,
                email
            }
        }
    },
    
    components: {
        Loading,
        VueSelect,
        userOptions,
        draggable
    },
    computed: {
        allFiles(){
            return this.$store.getters.getAllFiles
        },
        username(){
            return this.$store.getters.getUsername
        },
        allDirectories() {
            let allDir = this.$store.getters.getAllDirectories;
            if(this.userData.path != "root/home"){
                 let home = {directoryName: 'home',path: 'root'}
                allDir.splice(0, 0, home);
            }
            return allDir;
        },
        directories(){
            return this.$store.getters.getDirectoriesForAPath(this.userData.path)
        },
        files(){
            return this.$store.getters.getFilesForAPath(this.userData.path)
        },
        menuVisible(){
            return this.$store.getters.getShowMenu;
        },
        email(){
            return this.$store.getters.getEmail;
        }
    },
    props: {
        user: {
            type: Object
        }
    },
    async created(){
        await this.$store.dispatch('getFilesAndDirectories', this.user.path);
        // console.log("Starting connection to WebSocket Server", this.email);
        this.connection = new WebSocket("ws://localhost:3000/ws?email=" + this.email);

        this.connection.onmessage = function(e) {
            // console.log(JSON.parse(e.data));
            let res = JSON.parse(e.data);
            // console.log("RES", res);
            if(res.status ===200 && res.message==="File Shared with you"){
                this.sharedFiles += res.count;
                this.$toast(res.email + " just shared a with with you!",{
                    position: "bottom-center",
                    hideProgressBar: true
                }); 
                
            }
        }.bind(this);

        this.connection.onopen = function() {
            // console.log(event)
            // console.log("Successfully connected to the echo websocket server...")
        }

    },
    methods: {
        clickSharedTab (){
            this.sharedFiles = 0;
            this.$router.push({ name: "share" });
        },
        // sendMessage: function(message) {
        //     // console.log("Hello")
        //     console.log(this.connection);
        //     this.connection.send(message);
        // },
        dragUpdate(e){
            if(e.moved){
                return;
            }
            /**
             * Draggable adds the files to the directory list, delete and forceupdate
             */
            let ele = e.added.element;
            let directoryName = this.directories[e.added.newIndex+1];
            
            let dirInfo = this.allDirectories.find(obj => {
                return obj.directoryName === directoryName;
            })
            
            lodash.remove(this.directories, function(list){
                return list == ele;
            });
            this.checkedFiles.push(ele);
            this.selectedDir = dirInfo;
            this.moveFileToDirectory();
            this.forceUpdate();
        },
        hideDrawer(){
            this.styleObj.zIndex = "auto";
        },
        showDrawer(){
            this.styleObj.zIndex=null;
        },
        setSelected(value) {
            location.href = value.path;
        },
        toggleMenu () {
            // this.menuVisible = !this.menuVisible;
            let menu = !this.menuVisible;
            this.$store.commit('getShowMenu', menu);
        },
        getValidationClass(fieldName) {
            const field = this.$v.form[fieldName];

            if (field) {
            return {
                "md-invalid": field.$invalid && field.$dirty
                };
            }
        }, 
        clearCreateDirectoryForm() {
            this.form.directoryName = null;
            this.$v.form.directoryName.$reset();
        },
        validateCreateDirectory() {
            this.$v.form.directoryName.$touch();
            if (!this.$v.form.directoryName.$invalid) {
                this.handleCreateDirectory();
            }
        },
        async forceUpdate() {
            this.componentkey += 1;
        },
        async clearShareWithModal() {
            this.form.shareWithEmail = null;
            this.$v.form.shareWithEmail.$reset();
        },
        async shareFileWith() {
            this.$v.form.shareWithEmail.$touch();
            if (!this.$v.form.shareWithEmail.$invalid) {
                this.handleShareFile();
            }
        },
        
        showShareFileModal() {
            if(this.checkedFiles.length == 0){
                return;
            }
            this.shareToModal = true;
        },
        async showMoveFileModal() {
            if(this.checkedFiles.length === 0){
                return;
            }
            
            this.moveToModal = true;
        },
        async handleShareFile() {
            this.isLoading = true;
            this.shareToModal = false;
            const email = this.form.shareWithEmail;
            const path = this.userData.path;
            const res = await this.api.postData("/file/share_file", {
                email: email,
                files: this.checkedFiles,
                path: path
            });
            this.isLoading = false;
            if (res.data.status == 200) {
                this.$toast.success("Share Successful");
            } 
            else if (res.data.status == 401) {
                this.$router.push({ name: "login" });
            } 
            else {
                this.$toast.error("Share Error: " + "Cannot find user"); 
            }
        },
        async moveFileToDirectory() {
            let api = new Api();
            this.isLoading = true;
            this.moveToModal = false;

            const path = this.selectedDir.path + "/" + this.selectedDir.directoryName;
            const res = await api.putData("/user/move_files", {
                files: this.checkedFiles,
                path: path
            });
            this.isLoading = false;

            if (res.data.status == 200) {
                let update = this.$store.state.userData;
                
                /**
                 * Remove files from the store for this path
                 */

                update[this.userData.path]['files'] = update[this.userData.path]['files'].filter((item) => {
                    return this.checkedFiles.indexOf(item) == -1;
                })
                /**
                 * Add files to the new path
                 * First check if the new path is present in the store.
                 */
                 if(!(path in update)){
                    let obj = {files: [], directories: []};
                    update[path] = obj;
                }
                this.checkedFiles.forEach((item) => {
                    update[path]['files'].push(item);
                })
                this.$store.dispatch('commitMutex', update);
                this.$toast.success("Move Successful");
            }
            else if (res.data.status == 401) {
                this.$router.push({ name: "login" });
            }
            else {
                this.$toast.error("Move Error"); 
            }
            this.checkedFiles = [];
        },
        resetUpload() {
            this.$refs.file.value = "";
        },
        resetModal() {
            this.directoryName = "";
            this.directoryState = null;
        },
        async handleFileUpload(e) {
            let files = e.target.files || e.dataTransfer.files;
            let filesToUpload = [];
            let data = new FormData();
            this.isLoading = true;
           
            filesToUpload = lodash.filter(files, function(file) {
                if (this.files.indexOf(file.name) == -1) {
                    data.append("file_to_upload", file);
                    return file.name;
                }
                }.bind(this)
            );

            data.append("path", this.userData.path);
            if (filesToUpload.length == 0) {
                this.isLoading = false;
                this.$toast.warning("File Exists");
            } 
            else {
                let api = new Api();
                const res = await api.postData("/file/upload", data);
                this.isLoading = false;
                if (res.data.status == 200) {
                    let currentpath = this.userData.path.split(/\//);
                    currentpath.splice(0, 2);
                    let update = this.$store.state.userData;
                    
                    if(!(this.userData.path in update)){
                        let obj = {files: [], directories: []};
                        update[this.userData.path] = obj;
                    }
                    
                    for (let i = 0; i < filesToUpload.length; i++) {
                        update[this.userData.path]['files'].push(filesToUpload[i].name);
                    }
                    
                    this.$store.dispatch('commitMutex', update);
                    
                    this.$toast.success("Upload Sucessful");
                    if (filesToUpload.length != files.length) {
                        this.$toast.warning("File Exists");
                    }
                    
                } 
                else if (res.data.status == 401) {
                    this.$router.push({ name: "login" });
                }    
                else {
                    this.$toast.error("Upload Error"); 
                }
            }
            await this.forceUpdate();
        },
        async handleCreateDirectory() {
            const name = this.form.directoryName;
            this.directoryState = "valid";
            this.isLoading = true;
            this.createDirectoryModal = false;
            let api = new Api();
            const res = await api.postData("/file", {
                name: this.form.directoryName,
                path: this.userData.path
            });

            if (res.data.status == 200) {
                this.isLoading = false;
                /**
                 * Add the new directory to the store
                 */
                let update = this.$store.state.userData;
                 if(!(this.userData.path in update)){
                    let obj = {files: [], directories: []};
                    update[this.userData.path] = obj;
                }
                update[this.userData.path]['directories'].push(name);
                this.$store.dispatch('commitMutex', update);
                this.$toast.success("Directory Created", {
                    toastClassName: "my-custom-toast-class"
                });
            }
            else if (res.data.status == 401) {
                this.isLoading = false;
                this.$router.push({ name: "login" });
            }
            else {
                this.isLoading = false;
                this.$toast.error("Directory Create Error"); 
            }
        },
        async bulkDelete() {
            let api = new Api();
            this.isLoading = true;
            if (this.checkedFiles.length > 0 && this.checkedDirs.length > 0) {
                const resFiles = api.deleteFile("/file/delete", {
                    name: this.checkedFiles,
                    path: this.userData.path
                });
                const resDirs = api.deleteFile("/file/delete_dir", {
                    directoryName: this.checkedDirs,
                    path: this.userData.path
                });

                const res = await Promise.all([resFiles, resDirs]);
                this.isLoading = false;
                
                if (res[0].data.status == 200 && res[1].data.status == 200) {
                    let update = this.$store.state.userData;
                    update[this.userData.path]['files'] = update[this.userData.path]['files'].filter((item) => {
                        return this.checkedFiles.indexOf(item) == -1;
                    })

                    update[this.userData.path]['directories'] = update[this.userData.path]['directories'].filter((item) => {
                        return this.checkedDirs.indexOf(item) == -1;
                    })
                    /**
                     * Loop through the entire update object to remove the subdirectories
                     */
                    this.checkedDirs.forEach((dir) => {
                    let removeDir = this.userData.path + "/" + dir;
                    let len = Object.keys(update).length;
                    for(let i=0 ; i < len; i++) {
                        let name = Object.keys(update)[i];
                        if( name in update){
                            if(name.includes(removeDir)){
                                delete update[name];
                                i--;
                                }
                            }
                        } 
                    })
                    
                    await this.$store.dispatch('commitMutex', update);
                    
                    this.$toast.success("Delete Successful");
                    
                }
                else if (res[0].data.status == 401 || res[1].data.status == 401) {
                    this.$router.push({ name: "login" });
                }
                else if (res[0].data.status == 300 || res[1].data.status == 300) {
                    let text;
                    if (res[0].data.status == 300) {
                        text = res[0].data.message;
                    } 
                    else {
                        text = res[1].data.message;
                    }
                    
                    this.$toast.error("Delete Failed"); 
                    
                }
                this.checkedFiles = [];
                this.checkedDirs = [];
            }
            else if (this.checkedDirs.length > 0 && this.checkedFiles.length == 0) {
                const res = await api.deleteFile("/file/delete_dir", {
                directoryName: this.checkedDirs,
                path: this.userData.path
                });
                this.isLoading = false;
                if (res.data.status == 200) {
                    
                    let update = this.$store.state.userData;
                    // console.log("Whats in store? ", update);
                    update[this.userData.path]['directories'] = update[this.userData.path]['directories'].filter((item) => {
                        return this.checkedDirs.indexOf(item) == -1;
                    })
                    /**
                     * Loop through the entire update object to remove the subdirectories
                     */
                   this.checkedDirs.forEach((dir) => {
                    let removeDir = this.userData.path + "/" + dir;
                    let len = Object.keys(update).length;
                    for(let i=0 ; i < len; i++) {
                        let name = Object.keys(update)[i];
                        if( name in update){
                            if(name.includes(removeDir)){
                                delete update[name];
                                i--;
                                }
                            }
                        } 
                    })
                    this.$store.dispatch('commitMutex', update);
                    // this.userData.allDirectories = this.$store.getters.getAllDirectories;
                    this.$toast.success("Delete Successful");
                }
                else if (res.data.status == 401) {
                    this.$router.push({ name: "login" });
                }
                else {
                    this.$toast.error("Delete Failed"); 
                }
                this.checkedDirs = [];
            } 
            else if (this.checkedFiles.length > 0 && this.checkedDirs.length == 0) {
                const res = await api.deleteFile("/file/delete", {
                    name: this.checkedFiles,
                    path: this.userData.path
                });
                this.isLoading = false;
                if (res.data.status == 200) {
                   
                    let update = this.$store.state.userData;
                    update[this.userData.path]['files'] = update[this.userData.path]['files'].filter((item) => {
                        return this.checkedFiles.indexOf(item) == -1;
                    })

                    this.$store.dispatch('commitMutex', update);
                    
                    this.$toast.success("Delete Successful");
                    
                }
                else if (res.data.status == 401) {
                    this.$router.push({ name: "login" });
                }
                else {
                    
                    this.$toast.error("Delete Failed"); 
                    
                }
                this.checkedFiles = [];
            }
            else{
                this.isLoading = false;
                return;
            }
            await this.forceUpdate();

            this.allSelected = false;
    
        },
        async download() {
            try {
                if(this.checkedFiles.length === 0){
                    return;
                }
                let api = new Api();
                this.isLoading = true;
                const res = await api.getData(
                    "/file/download",
                    { file: this.checkedFiles, path: this.userData.path },
                    "blob"
                );
                this.isLoading = false;
                if (res.data.res == 401) {
                    this.$router.push({ name: "login" });
                }
                else if (res.data.status == 300) {
                    this.$toast.error("Download Error"); 
                }
                else {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    if (this.checkedFiles.length > 1) {
                        link.setAttribute("download", "Files.zip");
                    }
                    else {
                        link.setAttribute("download", res.config.params.file[0]);
                    }
                    document.body.appendChild(link);
                    link.click();
                }
            } catch (e) {
                // console.log("Error in download", e.message);
            }
        },
        selectAll() {
            this.checkedFiles = [];
            this.checkedDirs = [];
            if (this.allSelected) {
                for (var i = 0; i < this.files.length; i++) {
                this.checkedFiles.push(this.files[i]);
                }
                for (var j = 0; j < this.directories.length; j++) {
                    this.checkedDirs.push(this.directories[j]);
                }
            }
            else {
                this.checkedFiles = [];
                this.checkedDirs = [];
            }
        },
        select() {
            this.allSelected = false;
        }
    }
}
</script>

<style scoped>
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
    margin-left: 5px;
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
.ghost {
  opacity: 0.5;
  background: #c8d8fb;
}

.v-select{
    color:black;
}
.badge {
    width: 19px;
    height: 19px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 2px;
    right: 2px;
    background: red;
    border-radius: 100%;
    color: #fff;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    letter-spacing: -.05em;
    font-family: 'Roboto Mono', monospace;
  }
</style>