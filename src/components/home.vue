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
    name: 'home',
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
    computed: {
        email(){
            return this.$store.getters.getEmail;
        }
    },
    async created() {
        this.user.path="root/home";
        // await this.$store.dispatch('getFilesAndDirectories', this.user.path);
    }
}
</script>
