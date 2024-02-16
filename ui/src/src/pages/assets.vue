<template>
  <t4-page name="assets">
    <t4-navbar :sliding="false" large>
      <t4-nav-title>
        <i class="t4-navbar-logo"></i>
        <span>Generate Assets</span>
      </t4-nav-title>
      <t4-nav-title-large>
        <i class="t4-navbar-logo"></i>
        <span>Generate Assets</span>
      </t4-nav-title-large>
    </t4-navbar>

    <div class="center-content" v-if="project">
      <div class="row">
        <template v-if="project.type.indexOf('web') >= 0 || project.type.indexOf('pwa') >= 0">
          <t4-block-title class="col-100" medium>Web App Assets</t4-block-title>
          <div class="col-100 medium-33">
            <t4-block-title>Web Icon</t4-block-title>
            <label class="block block-strong inset drag-area">
              <t4-block-header>PNG image 512x512 size</t4-block-header>
              <div class="asset-preview">
                <img :src="getImage('/cwd/assets-src/web-icon.png')">
              </div>
              <t4-block-footer>{{dragText}}</t4-block-footer>
              <input type="file" name="web-icon" @change="setImage('web-icon', $event.target.files[0])">
            </label>
          </div>
          <div class="col-100 medium-33">
            <t4-block-title>Apple Touch Icon</t4-block-title>
            <label class="block block-strong inset drag-area">
              <t4-block-header>Square PNG image 256x256 size</t4-block-header>
              <div class="asset-preview">
                <img :src="getImage('/cwd/assets-src/apple-touch-icon.png')">
              </div>
              <t4-block-footer>{{dragText}}</t4-block-footer>
              <input type="file" name="apple-touch-icon" @change="setImage('apple-touch-icon', $event.target.files[0])">
            </label>
          </div>
        </template>

        <template v-if="project.type.indexOf('cordova') >= 0">
          <t4-block-title class="col-100" medium>Cordova Assets</t4-block-title>

          <div class="col-100 medium-33" v-if="project.cordova.platforms.indexOf('ios') >= 0">
            <t4-block-title>iOS Icon</t4-block-title>
            <label class="block block-strong inset drag-area">
              <t4-block-header>Square PNG image 1024x1024 size</t4-block-header>
              <div class="asset-preview">
                <img :src="getImage('/cwd/assets-src/cordova-ios-icon.png')">
              </div>
              <t4-block-footer>{{dragText}}</t4-block-footer>
              <input type="file" name="cordova-ios-icon" @change="setImage('cordova-ios-icon', $event.target.files[0])">
            </label>
          </div>

          <div class="col-100 medium-33" v-if="project.cordova.platforms.indexOf('android') >= 0">
            <t4-block-title>Android Icon</t4-block-title>
            <label class="block block-strong inset drag-area">
              <t4-block-header>Square PNG image 512x512 size</t4-block-header>
              <div class="asset-preview">
                <img :src="getImage('/cwd/assets-src/cordova-android-icon.png')">
              </div>
              <t4-block-footer>{{dragText}}</t4-block-footer>
              <input type="file" name="cordova-android-icon" @change="setImage('cordova-android-icon', $event.target.files[0])">
            </label>
          </div>

          <div class="col-100 medium-33" v-if="project.cordova.platforms.indexOf('electron') >= 0">
            <t4-block-title>Electron App Icon</t4-block-title>
            <label class="block block-strong inset drag-area">
              <t4-block-header>PNG image 1024x1024 size</t4-block-header>
              <div class="asset-preview">
                <img :src="getImage('/cwd/assets-src/cordova-electron-app-icon.png')">
              </div>
              <t4-block-footer>{{dragText}}</t4-block-footer>
              <input type="file" name="cordova-electron-app-icon" @change="setImage('cordova-electron-app-icon', $event.target.files[0])">
            </label>
          </div>

          <div class="col-100 medium-33" v-if="project.cordova.platforms.indexOf('electron') >= 0">
            <t4-block-title>Electron Installer Icon</t4-block-title>
            <label class="block block-strong inset drag-area">
              <t4-block-header>PNG image 1024x1024 size</t4-block-header>
              <div class="asset-preview">
                <img :src="getImage('/cwd/assets-src/cordova-electron-installer-icon.png')">
              </div>
              <t4-block-footer>{{dragText}}</t4-block-footer>
              <input type="file" name="cordova-electron-installer-icon" @change="setImage('cordova-electron-installer-icon', $event.target.files[0])">
            </label>
          </div>

          <div class="col-100 medium-33" v-if="project.cordova.platforms.indexOf('osx') >= 0">
            <t4-block-title>macOS Icon</t4-block-title>
            <label class="block block-strong inset drag-area">
              <t4-block-header>PNG image 1024x1024 size</t4-block-header>
              <div class="asset-preview">
                <img :src="getImage('/cwd/assets-src/cordova-osx-icon.png')">
              </div>
              <t4-block-footer>{{dragText}}</t4-block-footer>
              <input type="file" name="cordova-osx-icon" @change="setImage('cordova-osx-icon', $event.target.files[0])">
            </label>
          </div>

          <div class="col-100 medium-33" v-if="project.cordova.platforms.indexOf('android') >= 0 || project.cordova.platforms.indexOf('ios') >= 0">
            <t4-block-title>Splash Screen</t4-block-title>
            <label class="block block-strong inset drag-area">
              <t4-block-header>PNG image 2732x2732 size</t4-block-header>
              <div class="asset-preview">
                <img :src="getImage('/cwd/assets-src/cordova-splash-screen.png')">
              </div>
              <t4-block-footer>{{dragText}}</t4-block-footer>
              <input type="file" name="cordova-splash-screen" @change="setImage('cordova-splash-screen', $event.target.files[0])">
            </label>
          </div>
        </template>
      </div>

      <t4-popup class="popup-log" :closeByBackdropClick="false" :opened="log && log.length > 0">
        <pre ref="logEl" v-html="logText(log)"></pre>
      </t4-popup>

      <t4-block inset class="no-padding button-block">
        <t4-button v-if="!done && !error" :class="{loading: loading}" class="button-center-content" large fill round @click="generateAssets" icon-t4="gear_alt_fill" :text="loading ? 'Generating assets...' : 'Generate Assets'"></t4-button>
        <t4-button v-if="done" class="button-center-content" large fill round icon-t4="checkmark_alt" text="Done" color="green"></t4-button>
        <t4-button v-if="error" class="button-center-content" large fill round icon-t4="xmark" text="Error" color="red"></t4-button>
      </t4-block>
    </div>
  </t4-page>
</template>
<script>
  import { t4 } from 'techno4-vue';
  import { request } from 'techno4';
  import logText from '../utils/log-text';
  import getLog from '../utils/get-log';

  export default {
    data() {
      return {
        uploading: null,
        loading: false,
        log: [],
        done: false,
        error: false,

        project: null,
        dragText: 'Drag & drop new image or click to choose file'
      };
    },

    mounted() {
      const self = this;

      request.json('/api/project/').then((res) => {
        self.project = res.data;
      });

      let timeout;

      t4.$(self.$el).on('dragenter dragleave dragover', '.drag-area', function (e) {
        e.preventDefault();
        const $el = t4.$(this);
        if (e.type !== 'dragleave') $el.closest('.drag-area').addClass('dragenter');
        else $el.closest('.drag-area').removeClass('dragenter');
      });
      t4.$(self.$el).on('drop', '.drag-area', function (e) {
        e.preventDefault();
        const $el = t4.$(this);
        $el.closest('.drag-area').removeClass('dragenter');
        const name = $el.closest('.drag-area').find('input').attr('name');
        const file = e.dataTransfer.files[0];
        self.setImage(name, file);
      });
    },
    methods: {
      logText,
      getLog() {
        const self = this;
        getLog(self, '/api/assets/generate/');
      },
      getImage(src) {
        const self = this;
        if (self.uploading && src.indexOf(self.uploading) >= 0) return '';
        return `${src}?${new Date().getTime()}`;
      },
      setImage(name, file) {
        const self = this;
        if (!file) return;
        if (file.type !== 'image/png') {
          t4.dialog.alert('Only PNG images please');
          return;
        }
        const fd = new FormData();
        fd.append(name, file);
        self.uploading = name;
        request({
          method: 'post',
          contentType: 'multipart/form-data',
          url: '/api/assets/upload/',
          data: fd,
          complete() {
            self.uploading = null;
          }
        });
      },
      generateAssets() {
        const self = this;
        if (self.loading) return;
        self.loading = true;
        t4.request.postJSON('/api/assets/generate/', {}, () => {
          self.getLog();
        });
      },
    }
  }
</script>
