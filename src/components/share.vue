<template>
<div>
     <navigate />
    <div class="index-page">
       <div class="vld-parent">
            <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
           <md-card class="md-layout-item md-size-100 md-small-size-100" >
               <md-card-header>
                   <div class="md-title">Files shared with you..</div>
               </md-card-header>
                <md-tabs md-sync-route >
                    <md-tab id="tab-home" md-label="Home" to="/" md-alignment="center" exact/>
                    <md-tab id="tab-share" md-label="Shared" to="/share" md-alignment="center" exact/>
                    
                </md-tabs>
               <md-card-content>
                <div class="md-layout-item md-layout">
                </div>
                
                 <div class="md-layout">
                   
                    <md-button id="downloadFile" :disabled="checkedFiles.length==0" class="md-primary md-raised" v-on:click="download"> Download</md-button>
                        
                </div>  

                 <div  class="layout">
                    <div :hidden="sharedFiles.length == 0">
                        <input type="checkbox" class="delete" v-on:click="selectAll" v-model="allSelected">
                    </div>
                    <div v-for="(files) in sharedFiles" :key="files.file" >
                        <input type="checkbox" :value=files.file v-model="checkedFiles" class="delete" v-on:click="select">
                        <font-awesome-icon icon="file" size="2x"></font-awesome-icon>
                        <span class="data" :value=files.file> {{files.file}}</span>
                        <span class="data" :value= files.sharedBy> (Shared by : {{files.sharedBy}}) </span>
                    </div>
                 </div>
                <!-- <md-table v-model="sharedFiles" md-sort="file" md-sort-order="asc">
                    <md-table-toolbar> 
                        <h1 class="md-title">Files shared with you </h1>
                    </md-table-toolbar>
                    <md-table-row slot="md-table-row" slot-scope="{item}">
                        <md-table-cell md-label="File Name" md-sort-by="file" v-on:click="download">{{item.file}} </md-table-cell>
                        <md-table-cell md-label="Shared By" md-sort-by="sharedBy">{{item.sharedBy}} </md-table-cell>
                    </md-table-row>
                </md-table> -->

               </md-card-content>
           </md-card>

    </div>
    </div>
</template>
<script>
import navigate from './navigationBar';
import '../../node_modules/vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {Api} from '../api';
export default {
    name: "share",
    data(){
        return {
            sharedFiles: [],
            checkedFiles : [],
            api: new Api(),
            isLoading: false,
            fullPage: true,
            allSelected : false,
        }
    },
    async mounted(){
        let res = await this.api.getData('/file/get_shared_files',{});
        this.isLoading = true;
        
            this.isLoading = false;

            if(res.data.status == 200)
            {
                this.sharedFiles = res.data.data;
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
    components:{
        navigate,
        Loading
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
        
    selectAll()
    {
        this.checkedFiles = [];
        if(!this.allSelected)
        {
            for(var i =0; i<this.sharedFiles.length; i++)
            {
                this.checkedFiles.push(this.sharedFiles[i].file);
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
}
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
.data
{
    font-size: 22px; 
    border-top: none !important;
    white-space: nowrap;  
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
.delete{
    position: inherit;
    margin-right: 10px;
}
</style>