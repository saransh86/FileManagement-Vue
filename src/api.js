import axios from 'axios';
export class Api
{
    //url = 'http://localhost:3000';
    constructor()
    {
        axios.defaults.withCredentials = true;
        this.url = "http://localhost:3000";   
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

    // post()
    // {

    // }
}

