import Vue from 'vue'
import Vuex from 'vuex'
import { Api } from "../api";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // put variables and collections here
        username: '',
        files: [],
        directories: [],
        allDirectories: [],
        directoryName: [],
        allFiles: [],
        userData: {},
        sharedFiles: [],
        email: '',
        showMenu: false
    },
    mutations: {
        getShowMenu(state, menu){
            state.showMenu = menu;
        },
        getEmail(state, email){
            state.email = email;
        },
        getFilesForAPath(state, files){
            state.files = files;
        },
        getUsername(state, username){
            state.username = username;
        },
        getDirectoriesForAPath(state, directories){
            state.directories = directories;
        },
        getAllUserDirectories(state, allDirectories){
            state.allDirectories = allDirectories;
        },
        getAllUserFiles(state, allFiles){
            state.allFiles = allFiles;
        },
        getAllDataForUser(state, userData){
            state.userData = userData;
        },
        getSharedFiles(state, sharedFiles){
            state.sharedFiles = sharedFiles;
        }
    // put sychronous functions for changing state e.g. add, edit, delete
    },
    getters: {
        getShowMenu: state => {
            return state.showMenu;
        },
        getEmail : state =>{
            return state.email;
        },
        getAllUserData : state => {
            return state.userData;
        },
        getUsername: state => {
            return state.username;
        },
        getSharedFiles: state => {
            return state.sharedFiles;
        },
        getFilesForAPath: (state) => (path) => {
            const res = state.userData;
            if(path in res){
                state.files = res[path]['files'];
            }
            else{
                state.files = [];
            }
            return state.files;
        },
        getDirectoriesForAPath: (state) => (path) => {
            const res = state.userData;
            if(path in res){
                state.directories = res[path]['directories'];
            }
            else{
                state.directories = [];
            }
            return state.directories;
        },
        getAllDirectories: state => {
            const res = state.userData;
            
            // const directories = [];
            /*
            This way sucks ! O(n2)
            */
            state.allDirectories.length = 0;
            for(let i= 0; i < Object.keys(res).length; i++){
                
                res[Object.keys(res)[i]]['directories'].forEach(item => {
                    let obj = {};
                   
                    obj['directoryName'] = item;
                    obj['path'] = Object.keys(res)[i];
                    
                    state.allDirectories.push(obj);
                })  
            }
            
            return state.allDirectories;
        },
        getAllFiles : state => {
            
            const res = state.userData;
            state.allFiles.length = 0;
            for(let i= 0; i < Object.keys(res).length; i++){                
                res[Object.keys(res)[i]]['files'].forEach(item => {
                    let obj = {};
                    obj['fileName'] = item;
                    if(Object.keys(res)[i] == "root/home"){
                        obj['path'] = '/#/';
                    }
                    else{
                        const pathArr = Object.keys(res)[i].split(/\//);
                        pathArr.splice(0,2);
                        obj['path'] = "/#/" + pathArr.join('/');
                    }
                    state.allFiles.push(obj);
                })
                  
            }
            return state.allFiles;
        }
       
    },
    actions: {
        /**
         * 
         * @param {*} context 
         * @param {*} path 
         * 
         * obj = {'path_name' : {
         *  files: [],
         *  dir: []
         *  }}
         */
        getSharedFiles(context){
            return new Promise(async(resolve) => {
                let api = new Api();
                if(context.getters.getSharedFiles.length == 0){
                    const sharedFiles = await api.getData('/file/get_shared_files',{});
                    if(sharedFiles.data.status == 200){
                        context.commit('getSharedFiles', sharedFiles.data.data);
                        resolve(true)
                    }
                    else if(sharedFiles.data.status == 401){
                        context.$route.push({ name: "login" });
                    }
                    else{
                        resolve(false);
                    }
                }    
            })
        },
        getFilesAndDirectories(context, path){
           return new Promise (async (resolve) => {
                if(!(path in context.getters.getAllUserData)){
                    let api = new Api();
                    const res =  await api.getData("/home/welcome", {path: path});
                    // const sharedFilesPromise = api.getData('/file/get_shared_files',{});
                    // const[res, sharedFiles] = await Promise.all([welcomePromise, sharedFilesPromise]);
                    if(res.data.status == 200 ) {
                        context.commit('getUsername', res.data.data.username);
                        context.commit('getEmail',res.data.data.email);
                        context.commit('getAllDataForUser', res.data.data.result);
                        // context.commit('getSharedFiles', sharedFiles.data.data);
                        resolve(true);
                    }
                    else if( res.data.status == 401) {
                        context.$route.push({ name: "login" });
                    }
                    else{
                        resolve(false);
                    }
                }
                else{
                    resolve(true);
                }
                
           })
        },
        commitMutex(context, payload){
            return new Promise((resolve) => {
                context.state.userData = {};
                context.commit('getAllDataForUser', payload);
                resolve(true);
            })
            
        },
        reset(context){
            context.state.userData = {};
            context.state.files.length = 0;
            context.state.username = '';
            context.state.directories.length = 0;
            context.state.sharedFiles.length = 0;
            context.state.allDirectories.length = 0;
            context.state.allFiles.length = 0;
            context.state.showMenu = false;
        }
    }
})