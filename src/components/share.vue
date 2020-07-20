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
                <h3 class="md-title md-layout-item" style="flex :1">My_Files</h3>
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
                    <span>Welcome {{username}}</span>

                    <div class="md-toolbar-section-end">
                        <md-button class="md-icon-button md-dense" @click="toggleMenu">
                            <font-awesome-icon icon="angle-left"></font-awesome-icon>
                        </md-button>
                    </div>
                </md-toolbar>
                <md-list>
                    <md-list-item class="pointer" @click="download" :disabled="checkedFiles.length==0" id="submitDownload">
                        <md-icon :disabled="checkedFiles.length==0">
                            <font-awesome-icon icon="download"> </font-awesome-icon>
                            <md-tooltip md-direction="right">Download</md-tooltip>
                        </md-icon>
                        <span class="md-list-item-text pointer">Download</span>
                    </md-list-item>
                </md-list>
            </md-app-drawer>
        
            <md-app-content>
                <md-tabs md-sync-route>
                    <md-tab id="tab-home" md-label="Home" to="/" md-alignment="center" exact />
                    <md-tab id="tab-share" md-label="Shared" to="/share" md-alignment="center" exact />
                </md-tabs>
                <div>
                    <md-list>
                        <md-list-item>
                            <div :hidden="this.sharedFiles.length == 0">
                                <md-checkbox class="md-primary" @change="selectAll" v-model="allSelected" />
                            </div>
                        </md-list-item>
                        <div v-for="(files) in this.sharedFiles" :key="files.file">
                            <md-list-item>
                                <md-checkbox :value="files.file" v-model="checkedFiles" class="md-primary" @change="select"/>
                                <md-icon>
                                    <font-awesome-icon icon="file"></font-awesome-icon>
                                </md-icon>
                                <span class="md-list-item-text space" :value="files.file">{{files.file}}</span>
                                <!-- <span class="md-list-item-text space" :value= files.sharedBy> (Shared by : {{files.sharedBy}}) </span> -->
                            </md-list-item>
                        </div>
                    </md-list>
                </div>
            </md-app-content>
        </md-app>
    </div>
</template>
<script>
import userOptions from './userProfileOptions';
import VueSelect from 'vue-select';
import '../../node_modules/vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {Api} from '../api';
export default {
    name: "share",
    data(){
        return {
            // menuVisible: false,
            checkedFiles : [],
            api: new Api(),
            isLoading: false,
            fullPage: true,
            allSelected : false,
            selected: null,
            styleObj:{
                zIndex: null
            },
        }
    },
    async created(){
        this.$store.dispatch('getSharedFiles');
    },
    computed:{
        sharedFiles() {
            return this.$store.getters.getSharedFiles;
        },
        allFiles(){
            return this.$store.getters.getAllFiles
        },
        username(){
            return this.$store.getters.getUsername
        },
        menuVisible(){
            return this.$store.getters.getShowMenu;
        }
    },
    components:{
        Loading,
        VueSelect,
        userOptions
    },
    methods: {
        async download()
        {
            try{
                
                const res = await this.api.getData("/file/download_shared_file",{files: this.checkedFiles},'blob');
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
                else{
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    if(this.checkedFiles.length > 1){
                        link.setAttribute('download',"Files.zip");
                    }
                    else{
                        link.setAttribute('download',res.config.params.files[0]);
                    }
                    document.body.appendChild(link);
                    link.click();
                }
            }
            catch(e)
            {
                console.log("Error in download", e.message);
            } 
        },
        
        selectAll() {
            this.checkedFiles = [];
            if(this.allSelected) {
                for(var i =0; i<this.sharedFiles.length; i++) {
                    this.checkedFiles.push(this.sharedFiles[i].file);
                }
            }
            else {
                this.checkedFiles = [];
                this.checkedDirs = [];
            }
        },
        select() {
            this.allSelected = false;
        },
        setSelected(value) {
            location.href = value.path;
        }, 
        toggleMenu () {
            let menu = !this.menuVisible;
            this.$store.commit('getShowMenu', menu);
        },
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
</style>