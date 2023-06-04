<template>
    <div>
        <!-- <notifications group="notify" position="top center" /> -->
        <navigate :key="componentkey" v-bind:user="user" />
    </div>
</template>

<script>
import { Api } from "../api";
import navigate from "./navigationBar";
export default {
   name: 'directory',
   async beforeRouteEnter(to, from, next){
    //   /**
    //    * check to see if the directory exists
    //    */
        let api = new Api();
        let res = await api.checkDirectory(to);
        if(res.data.status == 200){
            next();
        }
        else{
            next({name: 'home'});
        }
    },
    async beforeRouteUpdate(to, from, next) {
    
        const basePath = "root/home";
        let dirs = to.path.split(/\//);
        let toPaths = [];
        let path;
        if(dirs.length >2){
            toPaths = to.path.split(/\//);
            toPaths.pop();
            path = basePath + toPaths.join('/');  
        }
        else{
            path = basePath;
        }
        let api = new Api();
        const res = await api.getData('/file/is_directory',{path: path, directory: dirs[dirs.length - 1]});
        if(res.data.status == 200){
            next();
        }
        else{
            next({name: 'home'});
        }
    },
    async created() { 
        this.init()
    },
    data(){
        return {
            path: "", 
            user : {
                path: '',
                directoryName: [],
                apath: ''
            },
            componentkey: 0,
            url: Api.getUrl() + "/#/",
            api: new Api()
        };
    },
    components: {
        navigate
    },
    methods: {
        async init(){
            this.isLoading = true;
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
            this.user.directoryName = res;
            this.user.apath = res[res.length - 1].path;
            this.path = "root/home/" + res[res.length - 1].path;
            
            this.$store.dispatch('getFilesAndDirectories', this.path);
            this.user.path = this.path;
            this.isLoading = false;
            
        },
    }
}
</script>