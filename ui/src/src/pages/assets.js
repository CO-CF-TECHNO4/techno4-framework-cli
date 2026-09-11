import Techno4 from 'techno4';
import logText from '../utils/log-text.js';
import getLog from '../utils/get-log.js';

export default (props, { $, $t4, $update, $onMounted, $el, $h }) => {
  let uploading = null;
  let loading = false;
  let log = [];
  let done = false;
  let error = false;
  let project = null;
  let popupInstance = null;
  const dragText = 'Drag & drop new image or click to choose file';

  function getImage(src) {
    if (uploading && src.indexOf(uploading) >= 0) return '';
    return `${src}?${new Date().getTime()}`;
  }

  function setImage(name, file) {
    if (!file) return;
    if (file.type !== 'image/png') {
      $t4.dialog.alert('Only PNG images please');
      return;
    }
    const fd = new FormData();
    fd.append(name, file);
    uploading = name;
    $update();
    Techno4.request({
      method: 'post',
      contentType: 'multipart/form-data',
      url: '/api/assets/upload/',
      data: fd,
      complete() {
        uploading = null;
        $update();
      },
    });
  }

  const pollState = {
    get log() {
      return log;
    },
    set log(val) {
      log = val;
      if (log && log.length > 0 && popupInstance && !popupInstance.opened) {
        popupInstance.open();
      }
      $update();
      setTimeout(() => {
        const pre = $el.value.find('.popup-log pre')[0];
        if (pre) pre.scrollTop = pre.scrollHeight - pre.offsetHeight;
      }, 50);
    },
    get done() {
      return done;
    },
    set done(val) {
      done = val;
      $update();
    },
    get error() {
      return error;
    },
    set error(val) {
      error = val;
      $update();
    },
    getLog() {
      getLog(pollState, '/api/assets/generate/');
    },
  };

  function generateAssets() {
    if (loading) return;
    loading = true;
    $update();
    Techno4.request.postJSON('/api/assets/generate/', {}, () => {
      pollState.getLog();
    });
  }

  $onMounted(() => {
    Techno4.request.json('/api/project/').then((res) => {
      project = res.data;
      $update();
    });

    popupInstance = $t4.popup.create({
      el: $el.value.find('.popup-log'),
      closeByBackdropClick: false,
    });

    $el.value.on('dragenter dragleave dragover', '.drag-area', function (e) {
      e.preventDefault();
      const $target = $(this);
      if (e.type !== 'dragleave') $target.closest('.drag-area').addClass('dragenter');
      else $target.closest('.drag-area').removeClass('dragenter');
    });

    $el.value.on('drop', '.drag-area', function (e) {
      e.preventDefault();
      const $target = $(this);
      $target.closest('.drag-area').removeClass('dragenter');
      const name = $target.closest('.drag-area').find('input').attr('name');
      const file = e.dataTransfer.files[0];
      setImage(name, file);
    });
  });

  return () => $h`
    <div class="page" data-name="assets">
      <div class="navbar navbar-large no-sliding">
        <div class="navbar-bg"></div>
        <div class="navbar-inner">
          <div class="left">
            <a href="/" class="link back">
              <i class="icon icon-back"></i>
              <span class="if-not-md">Back</span>
            </a>
          </div>
          <div class="title">
            <i class="t4-navbar-logo"></i>
            <span>Generate Assets</span>
          </div>
          <div class="title-large">
            <div class="title-large-text">
              <i class="t4-navbar-logo"></i>
              <span>Generate Assets</span>
            </div>
          </div>
        </div>
      </div>

      <div class="page-content">
        ${project ? $h`
          <div class="center-content">
            <div class="row">
              ${(project.type.indexOf('web') >= 0 || project.type.indexOf('pwa') >= 0) ? $h`
                <div class="block-title block-title-medium col-100">Web App Assets</div>
                <div class="col-100 medium-33">
                  <div class="block-title">Web Icon</div>
                  <label class="block block-strong inset drag-area">
                    <div class="block-header">PNG image 512x512 size</div>
                    <div class="asset-preview">
                      <img src="${getImage('/cwd/assets-src/web-icon.png')}" />
                    </div>
                    <div class="block-footer">${dragText}</div>
                    <input type="file" name="web-icon" @change="${(e) => setImage('web-icon', e.target.files[0])}" />
                  </label>
                </div>
                <div class="col-100 medium-33">
                  <div class="block-title">Apple Touch Icon</div>
                  <label class="block block-strong inset drag-area">
                    <div class="block-header">Square PNG image 256x256 size</div>
                    <div class="asset-preview">
                      <img src="${getImage('/cwd/assets-src/apple-touch-icon.png')}" />
                    </div>
                    <div class="block-footer">${dragText}</div>
                    <input type="file" name="apple-touch-icon" @change="${(e) => setImage('apple-touch-icon', e.target.files[0])}" />
                  </label>
                </div>
              ` : ''}

              ${project.type.indexOf('cordova') >= 0 ? $h`
                <div class="block-title block-title-medium col-100">Cordova Assets</div>

                ${project.cordova.platforms.indexOf('ios') >= 0 ? $h`
                  <div class="col-100 medium-33">
                    <div class="block-title">iOS Icon</div>
                    <label class="block block-strong inset drag-area">
                      <div class="block-header">Square PNG image 1024x1024 size</div>
                      <div class="asset-preview">
                        <img src="${getImage('/cwd/assets-src/cordova-ios-icon.png')}" />
                      </div>
                      <div class="block-footer">${dragText}</div>
                      <input type="file" name="cordova-ios-icon" @change="${(e) => setImage('cordova-ios-icon', e.target.files[0])}" />
                    </label>
                  </div>
                ` : ''}

                ${project.cordova.platforms.indexOf('android') >= 0 ? $h`
                  <div class="col-100 medium-33">
                    <div class="block-title">Android Icon</div>
                    <label class="block block-strong inset drag-area">
                      <div class="block-header">Square PNG image 512x512 size</div>
                      <div class="asset-preview">
                        <img src="${getImage('/cwd/assets-src/cordova-android-icon.png')}" />
                      </div>
                      <div class="block-footer">${dragText}</div>
                      <input type="file" name="cordova-android-icon" @change="${(e) => setImage('cordova-android-icon', e.target.files[0])}" />
                    </label>
                  </div>
                ` : ''}

                ${project.cordova.platforms.indexOf('electron') >= 0 ? $h`
                  <div class="col-100 medium-33">
                    <div class="block-title">Electron App Icon</div>
                    <label class="block block-strong inset drag-area">
                      <div class="block-header">PNG image 1024x1024 size</div>
                      <div class="asset-preview">
                        <img src="${getImage('/cwd/assets-src/cordova-electron-app-icon.png')}" />
                      </div>
                      <div class="block-footer">${dragText}</div>
                      <input type="file" name="cordova-electron-app-icon" @change="${(e) => setImage('cordova-electron-app-icon', e.target.files[0])}" />
                    </label>
                  </div>
                  <div class="col-100 medium-33">
                    <div class="block-title">Electron Installer Icon</div>
                    <label class="block block-strong inset drag-area">
                      <div class="block-header">PNG image 1024x1024 size</div>
                      <div class="asset-preview">
                        <img src="${getImage('/cwd/assets-src/cordova-electron-installer-icon.png')}" />
                      </div>
                      <div class="block-footer">${dragText}</div>
                      <input type="file" name="cordova-electron-installer-icon" @change="${(e) => setImage('cordova-electron-installer-icon', e.target.files[0])}" />
                    </label>
                  </div>
                ` : ''}

                ${project.cordova.platforms.indexOf('osx') >= 0 ? $h`
                  <div class="col-100 medium-33">
                    <div class="block-title">macOS Icon</div>
                    <label class="block block-strong inset drag-area">
                      <div class="block-header">PNG image 1024x1024 size</div>
                      <div class="asset-preview">
                        <img src="${getImage('/cwd/assets-src/cordova-osx-icon.png')}" />
                      </div>
                      <div class="block-footer">${dragText}</div>
                      <input type="file" name="cordova-osx-icon" @change="${(e) => setImage('cordova-osx-icon', e.target.files[0])}" />
                    </label>
                  </div>
                ` : ''}

                ${(project.cordova.platforms.indexOf('android') >= 0 || project.cordova.platforms.indexOf('ios') >= 0) ? $h`
                  <div class="col-100 medium-33">
                    <div class="block-title">Splash Screen</div>
                    <label class="block block-strong inset drag-area">
                      <div class="block-header">PNG image 2732x2732 size</div>
                      <div class="asset-preview">
                        <img src="${getImage('/cwd/assets-src/cordova-splash-screen.png')}" />
                      </div>
                      <div class="block-footer">${dragText}</div>
                      <input type="file" name="cordova-splash-screen" @change="${(e) => setImage('cordova-splash-screen', e.target.files[0])}" />
                    </label>
                  </div>
                ` : ''}
              ` : ''}
            </div>

            <div class="popup popup-log">
              <div class="page">
                <div class="page-content">
                  <pre innerHTML="${logText(log)}"></pre>
                </div>
              </div>
            </div>

            <div class="block block-strong inset no-padding button-block">
              ${!done && !error ? $h`
                <button class="button button-center-content button-large button-fill button-round ${loading ? 'loading' : ''}" @click="${generateAssets}">
                  <i class="icon t4-icons">gear_alt_fill</i>
                  <span>${loading ? 'Generating assets...' : 'Generate Assets'}</span>
                </button>
              ` : ''}
              ${done ? $h`
                <button class="button button-center-content button-large button-fill button-round color-green">
                  <i class="icon t4-icons">checkmark_alt</i>
                  <span>Done</span>
                </button>
              ` : ''}
              ${error ? $h`
                <button class="button button-center-content button-large button-fill button-round color-red">
                  <i class="icon t4-icons">xmark</i>
                  <span>Error</span>
                </button>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
};
