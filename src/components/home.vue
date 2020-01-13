<template>
  <div>
    <notifications group="notify" position="top center" />
    <navigate :key="componentkey" />

    <div class="index-page">
      <div class="vld-parent">
    	<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
      </div>
      <md-card class="md-layout-item md-size-100 md-small-size-100">
        <md-card-header>
          <div class="md-title">Welcome {{username}}</div>
        </md-card-header>
        <md-tabs md-sync-route>
        <md-tab id="tab-home" md-label="Home" to="/" md-alignment="center" exact />
          <md-tab id="tab-share" md-label="Shared" to="/share" md-alignment="center" exact />
        </md-tabs>
        <md-card-content>
          <div class="md-layout-item md-layout"></div>
          <div class="md-layout">
            <md-button
              id="submitCreateDirectory"
              class="md-primary md-raised"
              @click="createDirectoryModal= true"
            >Create</md-button>
            <md-button
              id="submitFileUpload"
              class="md-primary md-raised"
              @click="$refs.file.click()"
            >Upload</md-button>
            <md-button
              class="md-primary md-raised"
              id="submitDelete"
              :disabled="checkedFiles.length==0 && checkedDirs.length==0"
              v-on:click="bulkDelete"
            >Delete</md-button>
            <md-button
              class="md-primary md-raised"
              id="submitMove"
              :disabled="checkedFiles.length==0"
              @click="showMoveFileModal"
            >Move</md-button>
            <md-button
              class="md-primary md-raised"
              id="submitShare"
              :disabled="checkedFiles.length==0"
              @click="showShareFileModal"
            >Share</md-button>
            <md-button
              id="downloadFile"
              class="md-primary md-raised"
              v-on:click="download"
              :disabled="checkedFiles.length==0"
            >Download</md-button>
            <input
              type="file"
              hidden
              ref="file"
              name="file_to_upload"
              multiple
              v-on:change="handleFileUpload"
              v-on:click="resetUpload"
            />
          </div>

          <div class="layout">
            <div :hidden="files.length == 0 && directories.length == 0">
              <input type="checkbox" class="delete" v-on:click="selectAll" v-model="allSelected" />
            </div>
            <div v-for="(dir) in directories" :key="dir">
              <input
                type="checkbox"
                :value="dir"
                v-model="checkedDirs"
                class="delete"
                v-on:click="select"
              />
              <font-awesome-icon icon="folder-open" size="2x"></font-awesome-icon>
              <a class="data" v-bind:href="url + dir">{{dir}}</a>
            </div>
            <div v-for="(file) in files" :key="file">
              <input
                type="checkbox"
                :value="file"
                v-model="checkedFiles"
                class="delete"
                v-on:click="select"
              />
              <font-awesome-icon icon="file" size="2x"></font-awesome-icon>
              <span class="data" :value="file">{{file}}</span>

              <!-- <font-awesome-icon icon="trash-alt" class="delete" :name=file size="2x" v-on:click="deleteFile"></font-awesome-icon> -->
            </div>
          </div>
        </md-card-content>
      </md-card>

      <!--Modal for create Directory-->

      <md-dialog :md-active.sync="createDirectoryModal" v-on:md-closed="clearCreateDirectoryForm">
        <md-dialog-title>Create Directory</md-dialog-title>
        <form
          novalidate
          class="md-layout-item md-size-100 md-medium-size-100"
          @submit.prevent="validateCreateDirectory"
        >
          <md-dialog-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('directoryName')">
                  <label for="directoryName">Directory</label>
                  <md-input name="directoryName" id="directoryName" v-model="form.directoryName"></md-input>
                  <span
                    class="md-error"
                    v-if="!$v.form.directoryName.required"
                  >The directory name is required.</span>
                </md-field>
              </div>
            </div>
          </md-dialog-content>

          <md-dialog-actions>
            <md-button class="md-primary" @click="createDirectoryModal = false">Close</md-button>
            <md-button type="submit" class="md-primary">Create</md-button>
          </md-dialog-actions>
        </form>
      </md-dialog>
    </div>

    <!--Modal for move files-->
    <md-dialog :md-active.sync="moveToModal">
      <md-dialog-title>Move to</md-dialog-title>
      <form novalidate class="md-layout-item md-size-100" @submit.prevent="moveFileToDirectory">
        <md-dialog-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item">
              <!-- <md-field >
              <label for="moveToDirectory" > Move to directory</label>-->
              <!-- <md-select v-model="allDirectories.directoryName" placeholder="Directories" class="md-size-5">
                                    <md-option v-for="item in allDirectories" :key="item.directoryName" :value="item.path + '/' + item.directoryName"> {{ item.directoryName}}</md-option>   
              </md-select>-->

              <vue-select
                placeholder="Search Directories"
                :clearable="false"
                label="directoryName"
                v-model="selectedDir"
                :options="allDirectories"
              ></vue-select>
              <!-- </md-field> -->
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
    <md-dialog :md-active.sync="shareToModal" v-on:md-closed="clearShareWithModal">
      <md-dialog-title>Share File With</md-dialog-title>
      <form novalidate class="md-layout-item md-size-100" @submit.prevent="shareFileWith">
        <md-dialog-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('shareWithEmail')">
                <label for="shareWithEmail">Email</label>
                <md-input name="shareWithEmail" id="shareWithEmail" v-model="form.shareWithEmail"></md-input>
                <span
                  class="md-error"
                  v-if="!$v.form.shareWithEmail.required"
                >The email is required.</span>
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
import Loading from "vue-loading-overlay";
import { Api } from "../api";
import lodash from "lodash";
import navigate from "./navigationBar";
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
export default {
  name: "home",
  mixins: [validationMixin],
  data() {
    return {
      path: "",
      username: null,
      directories: [],
      files: [],

      selectedDir: null,

      allDirectories: [],

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
      url: "http://localhost:8080/#/",
      api: new Api()
    };
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
  async mounted() {
    await this.init();
  },
  components: {
    Loading,
    VueSelect,
    navigate
  },
  methods: {
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
    async init() {
      this.isLoading = true;
      this.path = "root/home";
      let api = new Api();
      const welcomePromise = api.getData("/home/welcome", { path: this.path });

      const allDirectoriesPromise = api.getData("/user/get_directories", {});
      const [res, allDirectories] = await Promise.all([
        welcomePromise,
        allDirectoriesPromise
      ]);
      this.isLoading = false;
      if (res.data.status == 200 && allDirectories.data.status == 200) {
        this.username = res.data.data.username;
        this.directories = res.data.data.directories;
        this.files = res.data.data.files;

        this.allDirectories = allDirectories.data.data;
      } else if (res.data.status == 401 || allDirectories.data.status == 401) {
        this.$router.push({ name: "login" });
      } else {
        var text;
        if (res.data.status == 300) {
          text = res.data.message;
        } else {
          text = allDirectories.data.message;
        }
        this.$notify({
          group: "notify",
          title: "Cannot load files at this time.",
          type: "error",
          text: text,
          duration: 10000
        });
      }
    },
    showShareFileModal() {
      this.shareToModal = true;
    },
    async showMoveFileModal() {
      let api = new Api();
      this.isLoading = true;
      const res = await api.getData("/user/get_directories", {});
      this.isLoading = false;
      if (res.data.status == 200) {
        this.allDirectories = res.data.data;
        //    this.$refs['moveModal'].show();
        this.moveToModal = true;
      } else if (res.data.status == 401) {
        this.$router.push({ name: "login" });
      } else {
        this.$notify({
          group: "notify",
          title: "Cannot load directores at this time.",
          type: "error",
          text: res.data.message,
          duration: 10000
        });
      }
    },
    async handleShareFile() {
      this.isLoading = true;
      this.shareToModal = false;
      const email = this.form.shareWithEmail;
      const path = this.path;
      const res = await this.api.postData("/file/share_file", {
        email: email,
        files: this.checkedFiles,
        path: path
      });
      this.isLoading = false;

      if (res.data.status == 200) {
        this.$notify({
          group: "notify",
          title: "Share Successful!",
          type: "success",
          text: res.data.message,
          duration: 10000
        });
      } else if (res.data.status == 401) {
        this.$router.push({ name: "login" });
      } else {
        this.$notify({
          group: "notify",
          title: "Share error.",
          type: "error",
          text: res.data.message,
          duration: 10000
        });
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
        this.files = this.files.filter(x => !this.checkedFiles.includes(x));
        this.$notify({
          group: "notify",
          title: "Move Successful!",
          type: "success",
          text: res.data.message,
          duration: 10000
        });
      } else if (res.data.status == 401) {
        this.$router.push({ name: "login" });
      } else {
        this.$notify({
          group: "notify",
          title: "Move error.",
          type: "error",
          text: res.data.message,
          duration: 10000
        });
      }
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

      filesToUpload = lodash.filter(
        files,
        function(file) {
          if (this.files.indexOf(file.name) == -1) {
            data.append("file_to_upload", file);
            return file.name;
          }
        }.bind(this)
      );

      data.append("path", this.path);
      if (filesToUpload.length == 0) {
        this.isLoading = false;
        this.$notify({
          group: "notify",
          title: "Upload existing files.",
          type: "warn",
          text: "Files you selected are already uploaded.",
          duration: 10000
        });
      } else {
        let api = new Api();
        const res = await api.postData("/file/upload", data);
        this.isLoading = false;
        if (res.data.status == 200) {
          let currentpath = this.path.split(/\//);
          currentpath.splice(0, 2);
          for (let i = 0; i < filesToUpload.length; i++) {
            this.files.push(filesToUpload[i].name);
            let obj = { fileName: "", path: "" };
            obj.fileName = filesToUpload[i].name;
            obj.path = "/#/" + currentpath.join("/");
          }

          this.$notify({
            group: "notify",
            title: "Upload Success!",
            type: "success",
            text: res.data.message,
            duration: 10000
          });
          if (filesToUpload.length != files.length) {
            this.$notify({
              group: "notify",
              title: "Upload existing files.",
              type: "warn",
              text: "Files you selected are already uploaded.",
              duration: 10000
            });
          }
        } else if (res.data.status == 401) {
          this.$router.push({ name: "login" });
        } else {
          this.$notify({
            group: "notify",
            title: "Upload error.",
            type: "error",
            text: res.data.message,
            duration: 10000
          });
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
        path: this.path
      });

      
      if (res.data.status == 200) {
        this.directories.push(name.trim());
        this.isLoading = false;
        this.$notify({
          group: "notify",
          title: "Directory Created!",
          type: "success",
          text: res.data.message,
          duration: 10000
        });
      } else if (res.data.status == 401) {
        this.isLoading = false;
        this.$router.push({ name: "login" });
      } else {
        this.isLoading = false;
        this.$notify({
          group: "notify",
          title: "Directory error.",
          type: "error",
          text: res.data.message,
          duration: 10000
        });
      }
    },
    async bulkDelete() {
      let api = new Api();
      this.isLoading = true;

      if (this.checkedFiles.length > 0 && this.checkedDirs.length > 0) {
        const resFiles = api.deleteFile("/file/delete", {
          name: this.checkedFiles,
          path: this.path
        });
        const resDirs = api.deleteFile("/file/delete_dir", {
          directoryName: this.checkedDirs,
          path: this.path
        });

        const res = await Promise.all([resFiles, resDirs]);
        this.isLoading = false;
        if (res[0].data.status == 200 && res[1].data.status == 200) {
          await this.init();

          this.$notify({
            group: "notify",
            title: "Delete Successful!",
            type: "success",
            text: "Delete successful for files and directories!",
            duration: 10000
          });
        } else if (res[0].data.status == 401 || res[1].data.status == 401) {
          this.$router.push({ name: "login" });
        } else if (res[0].data.status == 300 || res[1].data.status == 300) {
          var text;
          if (res[0].data.status == 300) {
            text = res[0].data.message;
          } else {
            text = res[1].data.message;
          }
          this.$notify({
            group: "notify",
            title: "Delete Failed.",
            type: "error",
            text: text,
            duration: 10000
          });
        }
        this.checkedFiles = [];
        this.checkedDirs = [];
      } else if (this.checkedDirs.length > 0 && this.checkedFiles.length == 0) {
        const res = await api.deleteFile("/file/delete_dir", {
          directoryName: this.checkedDirs,
          path: this.path
        });
        this.isLoading = false;
        if (res.data.status == 200) {
          await this.init();

          this.$notify({
            group: "notify",
            title: "Directory Delete Success!",
            type: "success",
            text: res.data.message,
            duration: 10000
          });
        } else if (res.data.status == 401) {
          this.$router.push({ name: "login" });
        } else {
          this.$notify({
            group: "notify",
            title: "Delete Directory Failed.",
            type: "error",
            text: res.data.message,
            duration: 10000
          });
        }
        this.checkedDirs = [];
      } else if (this.checkedFiles.length > 0 && this.checkedDirs.length == 0) {
        const res = await api.deleteFile("/file/delete", {
          name: this.checkedFiles,
          path: this.path
        });
        this.isLoading = false;
        if (res.data.status == 200) {
          await this.init();

          this.$notify({
            group: "notify",
            title: "File Delete Success!",
            type: "success",
            text: res.data.message,
            duration: 10000
          });
        } else if (res.data.status == 401) {
          this.$router.push({ name: "login" });
        } else {
          this.$notify({
            group: "notify",
            title: "File Directory Failed.",
            type: "error",
            text: res.data.message,
            duration: 10000
          });
        }
        this.checkedFiles = [];
      }
      await this.forceUpdate();

      this.allSelected = false;
      //})
    },

    async download() {
      try {
        let api = new Api();
        this.isLoading = true;
        const res = await api.getData(
          "/file/download",
          { file: this.checkedFiles, path: this.path },
          "blob"
        );
        this.isLoading = false;
        if (res.data.res == 401) {
          this.$router.push({ name: "login" });
        } else if (res.data.status == 300) {
          this.$notify({
            group: "notify",
            title: "Download error.",
            type: "error",
            text: res.data.message,
            duration: 10000
          });
        } else {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          if (this.checkedFiles.length > 1) {
            link.setAttribute("download", "Files.zip");
          } else {
            link.setAttribute("download", res.config.params.file[0]);
          }
          document.body.appendChild(link);
          link.click();
        }
      } catch (e) {
        console.log("Error in download", e.message);
      }
    },
    selectAll() {
      this.checkedFiles = [];
      this.checkedDirs = [];
      if (!this.allSelected) {
        for (var i = 0; i < this.files.length; i++) {
          this.checkedFiles.push(this.files[i]);
        }
        for (var j = 0; j < this.directories.length; j++) {
          this.checkedDirs.push(this.directories[j]);
        }
      } else {
        this.checkedFiles = [];
        this.checkedDirs = [];
      }
    },
    select() {
      this.allSelected = false;
    }
  }
};
</script>
<style scoped>
.md-dialog-content {
  overflow: inherit;
}
.md-dialog {
  overflow: visible;
}
.index-page {
  position: fixed;
  right: 100px;
  top: 60px;
  left: 100px;
  padding: 20px;
  background-color: white;
  /* overflow:auto; */
}
.delete {
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
h4 {
  margin-top: 20px;
}
.data {
  font-size: 22px;
  border-top: none !important;
  white-space: nowrap;
}
.md-theme-default a:not(.md-button) {
  text-decoration: none;
  color: black;
}
.dropdown-text {
  padding: 5px;
  text-align: center;
}
.searchBar {
  /* position: relative;
    top:20px; */
  width: 300px;
  background: white;
  margin-right: 10px;
}
.main-container {
  padding-right: 0px;
  padding-left: 0px;
  margin-right: 0px;
  margin-left: 0px;
}
.drop.over {
  border-color: #aaa;
  background: #ccc;
}
.navbar-brand {
  margin-left: 106px;
}
.ui-select-choices {
  position: fixed;
  top: auto;
  left: auto;
  width: inherit;
}
</style>


