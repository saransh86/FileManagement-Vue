import axios from 'axios';
export class Api
{
    static token = '';
    constructor()
    {
        axios.defaults.withCredentials = true;
        this.url = "http://localhost:3000";   
    }
    static getUrl() {
        return "";
    }
    postData(endpoint, data)
    {  
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.post(this.url + endpoint, data);
                resolve(res);
            }
            catch(e){
                reject(e);
            }
        })  
    }

    getData (endpoint, params, responseType="json")
    {
        return new Promise (async (resolve, reject) => {
            try{
                const res = await axios.get(this.url + endpoint,{params: params,responseType: responseType})
                resolve(res);
            }
            catch(e)
            {
                reject(e);
            }
        })
    }

    deleteFile(endpoint, data)
    {
        return new Promise(async(resolve, reject) => {
            try{
                const res = await axios.delete(this.url + endpoint,{data: data});
                resolve(res);
            }
            catch(e)
            {
                reject(e);
            }
        })
    }

    putData(endpoint, data)
    {
        return new Promise(async(resolve, reject) => {
            try{
                const res = await axios.put(this.url + endpoint, data);
                resolve(res);
            }
            catch(e)
            {
                reject(e);
            }
        })
    }

    getUsers(endpoint)
    {
        return new Promise(async(resolve, reject) => {
            try{
                const res = await axios.get(this.url + endpoint);
                resolve(res);
            }
            catch(e)
            {
                reject(e);
            }
        })
    }

    checkDirectory(to){
        return new Promise(async(resolve, reject) => {
         
            try{
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
                //let api = new Api();
                const res = await this.getData('/file/is_directory',{path: path, directory: dirs[dirs.length - 1]});
                resolve(res);
            }
            catch(e){
                reject(e);
            }
        })
        
        
    }

    // post()
    // {

    // }
}

