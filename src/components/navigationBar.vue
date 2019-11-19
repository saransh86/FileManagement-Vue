<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="success" sticky=true>
            <b-navbar-brand :href="url">File Management</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-auto">
                    <b-nav-form>
                        <div class="searchBar">
                             <vue-select placeholder="Search Files" @input="setSelected" :clearable="false" label="fileName" v-model="selected" :options="allFiles" ></vue-select>
                        </div>
                    </b-nav-form>
                    <userOptions/>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import {Api} from '../api';
import VueSelect from 'vue-select';
import userOptions from './userProfileOptions';
export default {
    name: 'nav',
    data() {
        return {
            url: "http://localhost:8080/#/",
            allFiles: [],
            selected :null
        }
    },
    async mounted () {
        this.allFiles.length = 0;
        await this.init();
    },
    components: {
       
        VueSelect,
        userOptions
    },
    methods: {
        async init()
        {
            let api = new Api();
            const allFiles = await api.getData('/user/get_files',{});
            if( allFiles.data.status == 200)
            {
                //console.log("Got the data", allFiles.data.data);
                
                this.allFiles = allFiles.data.data;
                
            }
            else if (allFiles.data.status == 401)
            {
                this.$router.push({name: 'login'});
            }
            else
            {
                //console.log("oops! Error!", res);
                this.$notify({
                    group: 'notify',
                    title: 'Cannot load files at this time.',
                    type: 'error',
                    text: "Uh ho. Something not right. Mind relogging?",
                    duration: 10000
                })
            }
        },
        setSelected(value) {
            console.log("Value ", value);
            
            location.href = value.path;
            console.log("Where", location.href);
        },
    }
}
</script>

<style scoped>
.navbar-brand{
    margin-left: 110px;
}
.searchBar{
    /* position: relative;
    top:20px; */
    width: 300px;
    background: white;
    margin-right: 10px;
}
</style>