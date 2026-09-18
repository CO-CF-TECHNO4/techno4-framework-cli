import Techno4 from 'techno4';
import logText from '../utils/log-text.js';
import getLog from '../utils/get-log.js';
import componentsList from '../utils/components-list.js';

export default (props, { $, $t4, $update, $onMounted, $el, $h }) => {
  let loading = false;
  let log = [];
  let done = false;
  let error = false;
  let generatingAssets = false;
  let cordovaAdvanced = false;

  const coreComponentsList = [
    'Statusbar',
    'View',
    'Navbar',
    'Toolbar',
    'Subnavbar',
    'Touch Ripple',
    'Modal',
    'Page',
    'Link',
    'Block',
    'List',
    'Badge',
    'Button',
    'Icon',
  ].sort();

  const allComponentsList = [...componentsList];

  let iconFile = null;
  let iconPreview = null;
  let cwd = '';
  let name = 'My App';
  let type = ['web'];
  let pkg = 'io.techno4.myapp';

  const cordova = {
    folder: 'cordova',
    platforms: ['ios', 'android'],
    plugins: [
      'cordova-plugin-statusbar',
      'cordova-plugin-keyboard',
      'cordova-plugin-splashscreen',
    ],
  };

  const capacitor = {
    platforms: ['ios', 'android'],
  };

  let framework = 'core';
  let template = 'single-view';
  let bundler = 'vite';
  let cssPreProcessor = false;

  const theming = {
    customColor: false,
    color: '#007aff',
    darkTheme: false,
    iconFonts: true,
    fillBars: false,
  };

  let customBuild = false;
  const customBuildConfig = {
    rtl: false,
    darkTheme: true,
    lightTheme: true,
    themes: ['ios', 'md', 'aurora'],
    components: [...componentsList],
  };

  let popupInstance = null;
  let colorPickerInstance = null;
  let barsStyleEl = null;

  function setDocumentThemeColor() {
    const { color, fillBars, darkTheme } = theming;
    let newColor;
    if (fillBars) {
      newColor = color;
    } else if (darkTheme) {
      newColor = '#212121';
    } else {
      newColor = '#fff';
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', newColor);
  }

  function applyFillBars(fillBars) {
    if (!barsStyleEl) {
      barsStyleEl = document.createElement('style');
      barsStyleEl.innerHTML = `
        :root,
        :root.dark,
        :root .dark {
          --t4-bars-bg-color: var(--t4-theme-color);
          --t4-bars-text-color: #fff;
          --t4-bars-link-color: #fff;
          --t4-navbar-subtitle-text-color: rgba(255,255,255,0.85);
          --t4-bars-border-color: transparent;
          --t4-tabbar-link-active-color: #fff;
          --t4-tabbar-link-inactive-color: rgba(255,255,255,0.54);
          --t4-searchbar-bg-color: var(--t4-bars-bg-color);
          --t4-searchbar-input-bg-color: #fff;
          --t4-searchbar-input-text-color: #000;
          --t4-sheet-border-color: transparent;
          --t4-tabbar-link-active-border-color: #fff;
        }
        .appbar,
        .navbar,
        .toolbar,
        .subnavbar,
        .calendar-header,
        .calendar-footer {
          --t4-touch-ripple-color: var(--t4-touch-ripple-white);
          --t4-link-highlight-color: var(--t4-link-highlight-white);
          --t4-button-text-color: #fff;
          --t4-button-pressed-bg-color: rgba(255,255,255,0.1);
        }
      `;
    }
    if (fillBars) {
      $('head').append(barsStyleEl);
    } else {
      $(barsStyleEl).remove();
    }
    setDocumentThemeColor();
  }

  function applyDarkTheme(darkTheme) {
    const html = $('html');
    if (darkTheme) {
      html.addClass('dark');
    } else {
      html.removeClass('dark');
    }
    setDocumentThemeColor();
  }

  function applyCustomColor(customColor, color) {
    const cssVars = $t4.utils.colorThemeCSSProperties(color);
    const html = $('html')[0];
    if (customColor) {
      Object.keys(cssVars).forEach((key) => {
        html.style.setProperty(key, cssVars[key]);
      });
    } else {
      Object.keys(cssVars).forEach((key) => {
        html.style.removeProperty(key);
      });
    }
    setDocumentThemeColor();
  }

  function toggleArrayValue(arr, value, remove) {
    if (remove) {
      const idx = arr.indexOf(value);
      if (idx >= 0) arr.splice(idx, 1);
    } else {
      const idx = arr.indexOf(value);
      if (idx < 0) arr.push(value);
      else arr.splice(idx, 1);
    }
    $update();
  }

  function toggleComponents() {
    if (customBuildConfig.components.length === allComponentsList.length) {
      customBuildConfig.components = [];
    } else {
      customBuildConfig.components = [...allComponentsList];
    }
    $update();
  }

  function getComponentsListComputed() {
    return allComponentsList.slice().sort().map((c) => ({
      component: c,
      name: c.split('-').map((word) => word[0].toUpperCase() + word.substring(1)).join(' '),
    }));
  }

  function resetIcon() {
    iconFile = null;
    iconPreview = null;
    const inp = $el.value.find('.create-app-icon input')[0];
    if (inp) inp.value = null;
    $update();
  }

  function onIconChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      iconPreview = reader.result;
      $update();
    };
    iconFile = file;
    reader.readAsDataURL(file);
  }

  function getOptions() {
    const options = {
      cwd,
      type,
      name,
      framework: 'core',
      template,
      bundler,
      cssPreProcessor,
      theming,
      customBuild,
    };
    if (options.customBuild) {
      options.bundler = 'vite';
      options.cssPreProcessor = 'less';
      options.customBuildConfig = customBuildConfig;
    }
    if (options.bundler !== 'vite') {
      options.cssPreProcessor = false;
    }
    if (type.indexOf('cordova') >= 0 && cordova.platforms.length) {
      options.pkg = pkg;
      options.cordova = cordova;
      if (cordova.platforms.indexOf('ios') < 0 && cordova.platforms.indexOf('android') < 0) {
        options.cordova.plugins = [];
      }
    }
    if (type.indexOf('capacitor') >= 0 && capacitor.platforms.length) {
      options.pkg = pkg;
      options.capacitor = capacitor;
    }
    return options;
  }

  function exportSettings() {
    const options = getOptions();
    delete options.cwd;
    const data = [JSON.stringify(options, '', 2)];
    let file;
    const fileName = `${options.name || 'techno4'}.json`;
    const properties = { type: 'application/json' };
    try {
      file = new File(data, fileName, properties);
    } catch (e) {
      file = new Blob(data, properties);
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.download = fileName;
    link.target = '_blank';
    link.href = url;
    link.click();
  }

  function importSettings(data) {
    if (data.type && data.type.indexOf('cordova') >= 0) {
      cordovaAdvanced = true;
    }
    if (data.name !== undefined) name = data.name;
    if (data.pkg !== undefined) pkg = data.pkg;
    if (data.type !== undefined) type = data.type;
    if (data.template !== undefined) template = data.template;
    if (data.bundler !== undefined) bundler = data.bundler;
    if (data.cssPreProcessor !== undefined) cssPreProcessor = data.cssPreProcessor;
    if (data.theming !== undefined) {
      Object.assign(theming, data.theming);
      applyDarkTheme(theming.darkTheme);
      applyFillBars(theming.fillBars);
      applyCustomColor(theming.customColor, theming.color);
    }
    if (data.cordova !== undefined) Object.assign(cordova, data.cordova);
    if (data.capacitor !== undefined) Object.assign(capacitor, data.capacitor);
    if (data.customBuild !== undefined) customBuild = data.customBuild;
    if (data.customBuildConfig !== undefined) Object.assign(customBuildConfig, data.customBuildConfig);
    $update();
  }

  function onImportInputChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = JSON.parse(reader.result);
      importSettings(content.techno4 || content);
    };
    reader.readAsText(file);
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
      if (done && iconFile) {
        done = false;
        loading = true;
        iconFile = null;
        generatingAssets = true;
        $update();
        Techno4.request.postJSON('/api/assets/generate/', { keepLog: true }).then(() => {
          pollState.getLog();
        });
        return;
      }
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
      getLog(pollState, generatingAssets ? '/api/assets/generate/' : '/api/create/');
    },
  };

  function createApp() {
    if (loading) return;
    const options = getOptions();
    if (!options.type.length) {
      $t4.dialog.alert('You must specify app type (Web app, PWA or Cordova app)');
      return;
    }
    if (options.type.indexOf('cordova') >= 0) {
      if (!options.pkg.trim()) {
        $t4.dialog.alert('You must specify app package (bundle ID)');
        return;
      }
      if (!options.cordova.platforms.length) {
        $t4.dialog.alert('You must specify target cordova platform');
        return;
      }
    }
    if (options.type.indexOf('capacitor') >= 0) {
      if (!options.pkg.trim()) {
        $t4.dialog.alert('You must specify app package (bundle ID)');
        return;
      }
      if (!options.capacitor.platforms.length) {
        $t4.dialog.alert('You must specify target Capacitor platform');
        return;
      }
    }
    if (!options.name) {
      $t4.dialog.alert('You must specify app name');
      return;
    }
    loading = true;
    $update();
    const data = new FormData();
    data.set('iconFile', iconFile);
    data.set('options', JSON.stringify(options));
    Techno4.request.post('/api/create/', data).then(() => {
      pollState.getLog();
    });
  }

  function initColorPicker() {
    if (colorPickerInstance) return;
    const colorPickerEl = $el.value.find('.color-picker-input')[0];
    if (!colorPickerEl) return;
    colorPickerInstance = $t4.colorPicker.create({
      inputEl: colorPickerEl,
      targetEl: $el.value.find('.color-picker-target')[0],
      targetElSetBackgroundColor: true,
      backdrop: false,
      routableModals: false,
      modules: ['sb-spectrum', 'hue-slider', 'hex'],
      hexLabel: true,
      hexValueEditable: true,
      cssClass: 'dark',
      value: { hex: theming.color },
      on: {
        change(cp, value) {
          theming.color = value.hex;
          applyCustomColor(theming.customColor, theming.color);
        },
      },
    });
  }

  $onMounted(() => {
    Techno4.request.json('/api/cwd/').then((res) => {
      cwd = res.data.cwd;
      $update();
    });

    popupInstance = $t4.popup.create({
      el: $el.value.find('.popup-log'),
      closeByBackdropClick: false,
    });

    if (theming.customColor) {
      initColorPicker();
    }
  });

  return () => {
    const computedComponents = getComponentsListComputed();

    return $h`
      <div class="page" data-name="create">
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
              <span>Create App</span>
            </div>
            <div class="right">
              <label class="tooltip-init link label-file-input" data-tooltip="Import project settings from .json file" style="color: var(--t4-navbar-link-color, var(--t4-bars-link-color, var(--t4-theme-color)));">
                <i class="t4-icons" style="font-size: 24px">tray_arrow_down_fill</i>
                <input type="file" @change="${onImportInputChange}" accept=".json" />
              </label>
              <a class="link margin-left tooltip-init" data-tooltip="Export project settings<br>to .json file" @click="${exportSettings}">
                <i class="t4-icons" style="font-size: 24px">tray_arrow_up_fill</i>
              </a>
            </div>
            <div class="title-large">
              <div class="title-large-text">
                <i class="t4-navbar-logo"></i>
                <span>Create App</span>
              </div>
            </div>
          </div>
        </div>

        <div class="page-content">
          <div class="center-content">
            <!-- GENERAL -->
            <div class="block block-strong medium-inset content-block">
              <div class="block-title block-title-large">
                <i class="t4-icons block-icon">info_circle</i>
                <span>General</span>
              </div>
              <div class="block-title block-title-medium">Destination</div>
              <div class="block-header">New Techno4 app will be created in the following directory.</div>
              <div class="list no-hairlines-between inputs-list">
                <ul>
                  <li class="item-content item-input item-input-outline">
                    <div class="item-inner">
                      <div class="item-input-wrap">
                        <input type="text" value="${cwd}" required validate validate-on-blur @input="${(e) => { cwd = e.target.value; }}" />
                        <span class="input-clear-button"></span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="block-footer display-flex align-items-center">
                <i style="font-size: 1.5em; margin-right: 8px" class="t4-icons text-color-orange">exclamationmark_triangle_fill</i>
                Make sure this folder is empty, the project will be created in the root of this folder.
              </div>

              <div class="row">
                <div class="col-25">
                  <div class="block-title block-title-medium">App Icon</div>
                  <div class="create-app-icon">
                    <label>
                      <img src="${iconPreview || '/static/icons/apple-touch-icon.png'}" />
                      <input type="file" accept="image/*" @change="${onIconChange}" />
                    </label>
                    <div>Click to choose app icon</div>
                    ${iconFile ? $h`
                      <div>
                        <a class="link" @click="${resetIcon}">Reset to default icon</a>
                      </div>
                    ` : ''}
                    <small><em>1024x1024 square PNG</em></small>
                  </div>
                </div>
                <div class="col-75">
                  <div class="row">
                    <div class="col-100 ${(type.indexOf('cordova') >= 0 || type.indexOf('capacitor') >= 0) ? 'medium-50' : ''}">
                      <div class="block-title block-title-medium">App (project) name</div>
                      <div class="list no-hairlines-between inputs-list">
                        <ul>
                          <li class="item-content item-input item-input-outline">
                            <div class="item-inner">
                              <div class="item-input-wrap">
                                <input type="text" value="${name}" required validate validate-on-blur @input="${(e) => { name = e.target.value; }}" />
                                <span class="input-clear-button"></span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    ${(type.indexOf('cordova') >= 0 || type.indexOf('capacitor') >= 0) ? $h`
                      <div class="col-100 medium-50">
                        <div class="block-title block-title-medium">App package (Bundle ID)</div>
                        <div class="list no-hairlines-between inputs-list">
                          <ul>
                            <li class="item-content item-input item-input-outline">
                              <div class="item-inner">
                                <div class="item-input-wrap">
                                  <input type="text" value="${pkg}" required validate validate-on-blur @input="${(e) => { pkg = e.target.value; }}" />
                                  <span class="input-clear-button"></span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                  <div class="block-title block-title-medium">App Type</div>
                  <div class="block-header">What types of the app are you targeting? (multiple allowed)</div>
                  <div class="row checkbox-row">
                    <div class="col-50 medium-25 checkbox-col ${type.indexOf('web') >= 0 ? 'checked' : ''}">
                      <div class="col-icon" @click="${() => toggleArrayValue(type, 'web')}">
                        <span class="text-icon">www</span>
                      </div>
                      <div class="col-label">Simple web app</div>
                    </div>
                    <div class="col-50 medium-25 checkbox-col ${type.indexOf('pwa') >= 0 ? 'checked' : ''}">
                      <div class="col-icon" @click="${() => toggleArrayValue(type, 'pwa')}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="134" height="50" viewBox="0 0 134 50">
                          <g fill="var(--checkbox-col-text-color)">
                            <polygon points="98.196 41.045 102.059 31.343 113.214 31.343 107.92 16.627 114.541 0 133.505 50 119.52 50 116.279 41.045" />
                            <polygon points="86.212 50 106.443 0 93.031 0 79.191 32.311 69.35 0 59.041 0 48.474 32.311 41.022 17.588 34.278 38.29 41.125 50 54.325 50 63.874 21.024 72.978 50" />
                            <path d="M12.7453596,32.8358409 L21.015736,32.8358409 C23.5209828,32.8358409 25.7518102,32.557516 27.7082184,32.0008663 L29.8470487,25.4418975 L35.8247423,7.11055644 C35.3692677,6.39195312 34.8492721,5.71251666 34.2647556,5.0723355 C31.1955651,1.69073966 26.7050671,0 20.7931248,0 L0,0 L0,50 L12.7453596,50 L12.7453596,32.8358409 Z M23.6924692,11.5030001 C24.8913023,12.7039946 25.4906505,14.3111488 25.4906505,16.3245987 C25.4906505,18.3534923 24.9634784,19.9626194 23.9092024,21.1519802 C22.7534289,22.47353 20.6252609,23.1342709 17.5248351,23.1342709 L12.7453596,23.1342709 L12.7453596,9.70140629 L17.5599663,9.70140629 C20.4495368,9.70140629 22.4937045,10.3019376 23.6924692,11.5030001 Z" />
                          </g>
                        </svg>
                      </div>
                      <div class="col-label">PWA (Progressive Web App)</div>
                    </div>
                    <div class="col-50 medium-25 checkbox-col ${type.indexOf('cordova') >= 0 ? 'checked' : ''}">
                      <div class="col-icon" @click="${() => { toggleArrayValue(type, 'cordova'); toggleArrayValue(type, 'capacitor', true); }}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="53" height="50" viewBox="0 0 53 50">
                          <path fill="var(--checkbox-col-text-color)" d="M47.5862069,50 L39.1133005,50 L39.7044335,42.8571429 L35.5418719,42.8571429 L34.9507389,50 L17.3891626,50 L16.7980296,42.8571429 L12.635468,42.8571429 L13.226601,50 L4.75369458,50 L0,19.0394089 L11.8965517,0 L40.4433498,0 L52.3399015,19.0394089 L47.5862069,50 Z M38.0541872,9.5320197 L30.4187192,9.5320197 L30.9359606,13.1034483 L21.4039409,13.1034483 L21.9211823,9.5320197 L14.2857143,9.5320197 L9.50738916,19.0394089 L11.8965517,38.0788177 L40.4433498,38.0788177 L42.8325123,19.0394089 L38.0541872,9.5320197 Z M33.8916256,31.773399 C33.226601,31.773399 32.7093596,29.8029557 32.7093596,27.3399015 C32.7093596,24.8768473 33.2512315,22.9064039 33.8916256,22.9064039 C34.5566502,22.9064039 35.0738916,24.8768473 35.0738916,27.3399015 C35.0738916,29.8029557 34.5566502,31.773399 33.8916256,31.773399 Z M18.8916256,32.1428571 C18.226601,32.1428571 17.7093596,30.1724138 17.7093596,27.7093596 C17.7093596,25.2463054 18.2512315,23.2758621 18.8916256,23.2758621 C19.5566502,23.2758621 20.0738916,25.2463054 20.0738916,27.7093596 C20.0738916,30.1724138 19.5320197,32.1428571 18.8916256,32.1428571 Z" />
                        </svg>
                      </div>
                      <div class="col-label">
                        Cordova app
                        <small>(targets native iOS and Android apps, or native desktop app with Electron)</small>
                      </div>
                    </div>
                    <div class="col-50 medium-25 checkbox-col ${type.indexOf('capacitor') >= 0 ? 'checked' : ''}">
                      <div class="col-icon" @click="${() => { toggleArrayValue(type, 'capacitor'); toggleArrayValue(type, 'cordova', true); }}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="126" height="24" viewBox="0 0 126 24">
                          <g fill-rule="evenodd">
                            <path fill="var(--checkbox-col-text-color)" fill-rule="nonzero" d="M30 11.8186C30 16.0223 33.0403 19.4133 37.4287 19.4133 41.8457 19.4133 44.0829 16.4147 44.4844 13.8083L41.0885 13.8083C40.687 15.3777 39.2356 16.4707 37.4 16.4707 34.962 16.4707 33.2066 14.537 33.2066 11.8186 33.2066 9.07214 34.962 7.13842 37.4 7.13842 39.2356 7.13842 40.687 8.23139 41.0885 9.80078L44.4844 9.80078C44.0829 7.19447 41.8457 4.1958 37.4287 4.1958 33.0403 4.1958 30 7.58682 30 11.8186z" />
                          </g>
                        </svg>
                      </div>
                      <div class="col-label">
                        Capacitor app
                        <small>(targets native iOS and Android apps)</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CAPACITOR -->
            ${type.indexOf('capacitor') >= 0 ? $h`
              <div class="block block-strong medium-inset content-block">
                <div class="block-title block-title-large">
                  <i class="block-icon block-icon-capacitor"></i>
                  <span>Capacitor</span>
                </div>
                <div class="block-title">Target Capacitor platform (multiple allowed)</div>
                <div class="row checkbox-row">
                  <div class="col-50 checkbox-col ${capacitor.platforms.indexOf('ios') >= 0 ? 'checked' : ''}">
                    <div class="col-icon" @click="${() => toggleArrayValue(capacitor.platforms, 'ios')}">
                      <i class="icon t4-icons">logo_apple</i>
                    </div>
                    <div class="col-label">iOS</div>
                  </div>
                  <div class="col-50 checkbox-col ${capacitor.platforms.indexOf('android') >= 0 ? 'checked' : ''}">
                    <div class="col-icon" @click="${() => toggleArrayValue(capacitor.platforms, 'android')}">
                      <i class="icon t4-icons">logo_android</i>
                    </div>
                    <div class="col-label">Android</div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- CORDOVA -->
            ${type.indexOf('cordova') >= 0 ? $h`
              <div class="block block-strong medium-inset content-block">
                <div class="block-title block-title-large">
                  <i class="block-icon block-icon-cordova"></i>
                  <span>Cordova</span>
                  <div class="right">
                    <span class="toggle-label disabled">Advanced</span>
                    <label class="toggle toggle-init color-green">
                      <input type="checkbox" checked="${cordovaAdvanced}" @change="${(e) => { cordovaAdvanced = e.target.checked; $update(); }}" />
                      <span class="toggle-icon"></span>
                    </label>
                  </div>
                </div>

                <div class="block-title">Target Cordova platform (multiple allowed)</div>
                <div class="row checkbox-row">
                  <div class="col-50 medium-25 checkbox-col ${cordova.platforms.indexOf('ios') >= 0 ? 'checked' : ''}">
                    <div class="col-icon" @click="${() => toggleArrayValue(cordova.platforms, 'ios')}">
                      <i class="icon t4-icons">logo_apple</i>
                    </div>
                    <div class="col-label">iOS</div>
                  </div>
                  <div class="col-50 medium-25 checkbox-col ${cordova.platforms.indexOf('android') >= 0 ? 'checked' : ''}">
                    <div class="col-icon" @click="${() => toggleArrayValue(cordova.platforms, 'android')}">
                      <i class="icon t4-icons">logo_android</i>
                    </div>
                    <div class="col-label">Android</div>
                  </div>
                  <div class="col-50 medium-25 checkbox-col ${cordova.platforms.indexOf('electron') >= 0 ? 'checked' : ''}">
                    <div class="col-icon" @click="${() => toggleArrayValue(cordova.platforms, 'electron')}">
                      <i class="icon t4-icons">device_desktop</i>
                    </div>
                    <div class="col-label">Electron</div>
                  </div>
                  <div class="col-50 medium-25 checkbox-col ${cordova.platforms.indexOf('osx') >= 0 ? 'checked' : ''}">
                    <div class="col-icon" @click="${() => toggleArrayValue(cordova.platforms, 'osx')}">
                      <i class="icon t4-icons">logo_macos</i>
                    </div>
                    <div class="col-label">macOS<small>(when you don't need Electron functionality)</small></div>
                  </div>
                </div>

                ${cordovaAdvanced ? $h`
                  <div class="block-title">Pre-installed Cordova plugins</div>
                  <div class="block-header">Will be installed only if <b>iOS</b> or <b>Android</b> platforms selected.</div>
                  <div class="list media-list no-hairlines-between">
                    <ul>
                      ${[
                        { id: 'cordova-plugin-statusbar', title: 'cordova-plugin-statusbar', text: 'Allows to customize native iOS and Android status bar' },
                        { id: 'cordova-plugin-keyboard', title: 'cordova-plugin-keyboard', text: 'Allows to correctly handle native keyboard and shrink/expand webview on keyboard open/close' },
                        { id: 'cordova-plugin-splashscreen', title: 'cordova-plugin-splashscreen', text: 'Display and hide splash screen during application launch' },
                        { id: 'cordova-plugin-device', title: 'cordova-plugin-device', text: 'Plugin provides information about device software and hardware' },
                        { id: 'cordova-plugin-inappbrowser', title: 'cordova-plugin-inappbrowser', text: 'Plugin provides a web browser to display an external web content' },
                        { id: 'cordova-plugin-file', title: 'cordova-plugin-file', text: 'Plugin implements a File API allowing read/write access to files residing on the device.' },
                        { id: 'cordova-plugin-media', title: 'cordova-plugin-media', text: 'Plugin provides the ability to record and play back audio files on a device' },
                        { id: 'cordova-plugin-safariviewcontroller', title: 'cordova-plugin-safariviewcontroller', text: 'Better and more modern implementation of in-app browser (for iOS only)' },
                      ].map((item) => $h`
                        <li>
                          <label class="item-checkbox item-content">
                            <input type="checkbox" checked="${cordova.plugins.indexOf(item.id) >= 0}" @change="${() => toggleArrayValue(cordova.plugins, item.id)}" />
                            <i class="icon icon-checkbox"></i>
                            <div class="item-inner">
                              <div class="item-title-row">
                                <div class="item-title">${item.title}</div>
                              </div>
                              <div class="item-text">${item.text}</div>
                            </div>
                          </label>
                        </li>
                      `)}
                    </ul>
                  </div>
                ` : ''}
              </div>
            ` : ''}

            <!-- FRAMEWORK -->
            <div class="block block-strong medium-inset content-block">
              <div class="block-title block-title-large">
                <i class="t4-icons block-icon">gear</i>
                <span>Framework</span>
              </div>
              <div class="block-title">What type of framework do you prefer?</div>
              <div class="row checkbox-row">
                <div class="col-50 medium-25 checkbox-col checked">
                  <div class="col-icon" @click="${() => { framework = 'core'; $update(); }}">
                    <img src="../assets/t4framework-icon.png" />
                  </div>
                  <div class="col-label">Techno4 Core</div>
                </div>
              </div>
            </div>

            <!-- STARTER TEMPLATE -->
            <div class="block block-strong medium-inset content-block">
              <div class="block-title block-title-large">
                <i class="t4-icons block-icon">rocket_fill</i>
                <span>Starter template</span>
              </div>
              <div class="block-title">Choose starter template</div>
              <div class="row checkbox-row">
                ${[
                  { id: 'blank', icon: '../assets/t-blank.svg', label: 'Blank' },
                  { id: 'single-view', icon: '../assets/t-single-view.svg', label: 'Single View' },
                  { id: 'tabs', icon: '../assets/t-tabs.svg', label: 'Tabbed Views (Tabs)' },
                  { id: 'split-view', icon: '../assets/t-split-view.svg', label: 'Split View (Split Panel)' },
                  { id: 'audio-studio', icon: '../assets/t-tabs.svg', label: 'Audio & Threads Studio' },
                ].map((tpl) => $h`
                  <div class="col-50 medium-25 checkbox-col checkbox-template-col ${template === tpl.id ? 'checked' : ''}">
                    <div class="col-icon" @click="${() => { template = tpl.id; $update(); }}">
                      <img src="${tpl.icon}" />
                    </div>
                    <div class="col-label">${tpl.label}</div>
                  </div>
                `)}
              </div>
            </div>

            <!-- BUNDLER -->
            <div class="block block-strong medium-inset content-block">
              <div class="block-title block-title-large">
                <i class="block-icon block-icon-vite"></i>
                <span>Bundler</span>
              </div>
              <div class="block-title">Should we setup project with bundler?</div>
              <div class="list medium-inset">
                <ul>
                  <li>
                    <label class="item-radio item-content ${customBuild ? 'disabled' : ''}">
                      <input type="radio" name="bundler-radio" value="false" checked="${bundler === false && !customBuild}" disabled="${customBuild}" @change="${() => { bundler = false; $update(); }}" />
                      <i class="icon icon-radio"></i>
                      <div class="item-inner">
                        <div class="item-title">No bundler</div>
                      </div>
                    </label>
                  </li>
                  <li>
                    <label class="item-radio item-content">
                      <input type="radio" name="bundler-radio" value="vite" checked="${bundler === 'vite' || customBuild}" @change="${() => { bundler = 'vite'; $update(); }}" />
                      <i class="icon icon-radio"></i>
                      <div class="item-inner">
                        <div class="item-title">Vite (recommended)</div>
                      </div>
                    </label>
                  </li>
                </ul>
              </div>

              ${bundler === 'vite' ? $h`
                <div class="block block-strong inset text-color-red no-margin border-color-red" style="border-width: 2px; border-style: solid; margin-top: -32px !important">
                  <p><b>Attention!</b></p>
                  <p>For Vite it is recommended to have modern and latest Node.js and NPM. Make sure you have at least Node.js v14 and NPM v7 installed on your system.</p>
                  ${type.indexOf('cordova') >= 0 ? $h`
                    <p>For Cordova app Vite build will be rebundled with Rollup (to workaround unsupported browser ES modules in Cordova web view), this means you should avoid dynamic imports (code splitting) with <code>import().then()</code> in your source code.</p>
                  ` : ''}
                </div>

                <div class="block-title">Do you want to setup CSS Pre-Processor?</div>
                <div class="list">
                  <ul>
                    ${[
                      { id: false, label: 'No, i am good with CSS' },
                      { id: 'less', label: 'Less' },
                      { id: 'stylus', label: 'Stylus' },
                      { id: 'scss', label: 'SCSS (SASS)' },
                    ].map((item) => $h`
                      <li>
                        <label class="item-radio item-content ${(customBuild && item.id !== 'less') ? 'disabled' : ''}">
                          <input type="radio" name="css-radio" checked="${customBuild ? item.id === 'less' : cssPreProcessor === item.id}" disabled="${customBuild && item.id !== 'less'}" @change="${() => { cssPreProcessor = item.id; $update(); }}" />
                          <i class="icon icon-radio"></i>
                          <div class="item-inner">
                            <div class="item-title">${item.label}</div>
                          </div>
                        </label>
                      </li>
                    `)}
                  </ul>
                </div>
              ` : ''}
            </div>

            <!-- THEMING -->
            <div class="block block-strong medium-inset content-block">
              <div class="block-title block-title-large">
                <i class="t4-icons block-icon">color_filter</i>
                <span>Theming</span>
              </div>
              <div class="list media-list no-hairlines-between">
                <ul>
                  <li>
                    <label class="item-checkbox item-content">
                      <input type="checkbox" checked="${theming.iconFonts === true}" @change="${(e) => { theming.iconFonts = e.target.checked; $update(); }}" />
                      <i class="icon icon-checkbox"></i>
                      <div class="item-inner">
                        <div class="item-title">Include Techno4 Icons and Material Icons icon fonts</div>
                        <div class="item-text">Disable if you want to use own custom icons</div>
                      </div>
                    </label>
                  </li>
                  <li>
                    <label class="item-checkbox item-content">
                      <input type="checkbox" checked="${theming.customColor === true}" @change="${(e) => {
                        theming.customColor = e.target.checked;
                        applyCustomColor(theming.customColor, theming.color);
                        $update();
                        if (theming.customColor) setTimeout(initColorPicker, 50);
                      }}" />
                      <i class="icon icon-checkbox"></i>
                      <div class="item-inner">
                        <div class="item-title">Custom color theme</div>
                        <div class="item-text">Enable to specify custom color theme</div>
                      </div>
                    </label>
                  </li>
                  ${theming.customColor ? $h`
                    <li class="item-content item-input item-input-outline">
                      <div class="item-media">
                        <i class="icon color-picker-target" style="border-radius: 4px; width: 18px; height: 18px; background-color: ${theming.color}"></i>
                      </div>
                      <div class="item-inner">
                        <div class="item-title item-floating-label">Enter custom theme color</div>
                        <div class="item-input-wrap">
                          <input class="color-picker-input" type="text" placeholder="e.g. #ff0000" value="${theming.color}" readonly />
                        </div>
                      </div>
                    </li>
                  ` : ''}
                  <li>
                    <label class="item-checkbox item-content">
                      <input type="checkbox" checked="${theming.darkTheme === true}" @change="${(e) => {
                        theming.darkTheme = e.target.checked;
                        applyDarkTheme(theming.darkTheme);
                        $update();
                      }}" />
                      <i class="icon icon-checkbox"></i>
                      <div class="item-inner">
                        <div class="item-title">Dark theme</div>
                        <div class="item-text">Enables dark theme by default</div>
                      </div>
                    </label>
                  </li>
                  <li>
                    <label class="item-checkbox item-content">
                      <input type="checkbox" checked="${theming.fillBars === true}" @change="${(e) => {
                        theming.fillBars = e.target.checked;
                        applyFillBars(theming.fillBars);
                        $update();
                      }}" />
                      <i class="icon icon-checkbox"></i>
                      <div class="item-inner">
                        <div class="item-title">Fill style navigation bars</div>
                        <div class="item-text">Enables navigation bars to be fill with color</div>
                      </div>
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Techno4 CUSTOM BUILD -->
            <div class="block block-strong medium-inset content-block">
              <div class="block-title block-title-large">
                <i class="t4-icons block-icon">square_grid_2x2_fill</i>
                <span>Techno4 Custom Build</span>
                <div class="right">
                  <span class="toggle-label disabled">Enable</span>
                  <label class="toggle toggle-init color-green">
                    <input type="checkbox" checked="${customBuild}" @change="${(e) => {
                      customBuild = e.target.checked;
                      if (customBuild) {
                        bundler = 'vite';
                        cssPreProcessor = 'less';
                      }
                      $update();
                    }}" />
                    <span class="toggle-icon"></span>
                  </label>
                </div>
              </div>

              ${!customBuild ? $h`
                <p class="text-align-center">
                  <i class="t4-icons text-color-orange">exclamationmark_triangle_fill</i><br />
                  Enabling custom build will automatically enable Vite bundler with Less pre-processor
                </p>
              ` : $h`
                <div class="block-title block-title-medium">Core components (required)</div>
                <div class="row">
                  <div class="col-50">
                    <div class="list no-hairlines-between no-margin-top">
                      <ul>
                        ${coreComponentsList.filter((_, idx) => idx < 7).map((item) => $h`
                          <li>
                            <label class="item-checkbox item-content disabled">
                              <input type="checkbox" checked disabled />
                              <i class="icon icon-checkbox"></i>
                              <div class="item-inner">
                                <div class="item-title">${item}</div>
                              </div>
                            </label>
                          </li>
                        `)}
                      </ul>
                    </div>
                  </div>
                  <div class="col-50">
                    <div class="list no-hairlines-between no-margin-top">
                      <ul>
                        ${coreComponentsList.filter((_, idx) => idx >= 7).map((item) => $h`
                          <li>
                            <label class="item-checkbox item-content disabled">
                              <input type="checkbox" checked disabled />
                              <i class="icon icon-checkbox"></i>
                              <div class="item-inner">
                                <div class="item-title">${item}</div>
                              </div>
                            </label>
                          </li>
                        `)}
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="block-title block-title-medium">
                  Customizable list of components / <a class="link" @click="${toggleComponents}">Toggle all</a>
                </div>

                <div class="row">
                  <div class="col-33">
                    <div class="list no-hairlines-between no-margin-top">
                      <ul>
                        ${computedComponents.filter((_, idx) => idx < 19).map((c) => $h`
                          <li>
                            <label class="item-checkbox item-content">
                              <input type="checkbox" checked="${customBuildConfig.components.indexOf(c.component) >= 0}" @change="${() => toggleArrayValue(customBuildConfig.components, c.component)}" />
                              <i class="icon icon-checkbox"></i>
                              <div class="item-inner">
                                <div class="item-title">${c.name}</div>
                              </div>
                            </label>
                          </li>
                        `)}
                      </ul>
                    </div>
                  </div>
                  <div class="col-33">
                    <div class="list no-hairlines-between no-margin-top">
                      <ul>
                        ${computedComponents.filter((_, idx) => idx >= 19 && idx < 38).map((c) => $h`
                          <li>
                            <label class="item-checkbox item-content">
                              <input type="checkbox" checked="${customBuildConfig.components.indexOf(c.component) >= 0}" @change="${() => toggleArrayValue(customBuildConfig.components, c.component)}" />
                              <i class="icon icon-checkbox"></i>
                              <div class="item-inner">
                                <div class="item-title">${c.name}</div>
                              </div>
                            </label>
                          </li>
                        `)}
                      </ul>
                    </div>
                  </div>
                  <div class="col-33">
                    <div class="list no-hairlines-between no-margin-top">
                      <ul>
                        ${computedComponents.filter((_, idx) => idx >= 38).map((c) => $h`
                          <li>
                            <label class="item-checkbox item-content">
                              <input type="checkbox" checked="${customBuildConfig.components.indexOf(c.component) >= 0}" @change="${() => toggleArrayValue(customBuildConfig.components, c.component)}" />
                              <i class="icon icon-checkbox"></i>
                              <div class="item-inner">
                                <div class="item-title">${c.name}</div>
                              </div>
                            </label>
                          </li>
                        `)}
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="block-title block-title-medium">CSS</div>
                <div class="list no-hairlines-between">
                  <ul>
                    <li>
                      <label class="item-checkbox item-content">
                        <input type="checkbox" checked="${customBuildConfig.themes.indexOf('ios') >= 0}" @change="${() => toggleArrayValue(customBuildConfig.themes, 'ios')}" />
                        <i class="icon icon-checkbox"></i>
                        <div class="item-inner">
                          <div class="item-title">Include iOS theme</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <label class="item-checkbox item-content">
                        <input type="checkbox" checked="${customBuildConfig.themes.indexOf('md') >= 0}" @change="${() => toggleArrayValue(customBuildConfig.themes, 'md')}" />
                        <i class="icon icon-checkbox"></i>
                        <div class="item-inner">
                          <div class="item-title">Include MD theme</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <label class="item-checkbox item-content">
                        <input type="checkbox" checked="${customBuildConfig.themes.indexOf('aurora') >= 0}" @change="${() => toggleArrayValue(customBuildConfig.themes, 'aurora')}" />
                        <i class="icon icon-checkbox"></i>
                        <div class="item-inner">
                          <div class="item-title">Include Aurora theme</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <label class="item-checkbox item-content">
                        <input type="checkbox" checked="${customBuildConfig.darkTheme}" @change="${(e) => { customBuildConfig.darkTheme = e.target.checked; $update(); }}" />
                        <i class="icon icon-checkbox"></i>
                        <div class="item-inner">
                          <div class="item-title">Include Dark theme</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <label class="item-checkbox item-content">
                        <input type="checkbox" checked="${customBuildConfig.lightTheme}" @change="${(e) => { customBuildConfig.lightTheme = e.target.checked; $update(); }}" />
                        <i class="icon icon-checkbox"></i>
                        <div class="item-inner">
                          <div class="item-title">Include Light theme</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <label class="item-checkbox item-content">
                        <input type="checkbox" checked="${customBuildConfig.rtl}" @change="${() => { customBuildConfig.rtl = !customBuildConfig.rtl; $update(); }}" />
                        <i class="icon icon-checkbox"></i>
                        <div class="item-inner">
                          <div class="item-title">RTL Layout</div>
                        </div>
                      </label>
                    </li>
                  </ul>
                </div>
              `}
            </div>

            <!-- POPUP LOG -->
            <div class="popup popup-log">
              <div class="page">
                <div class="page-content">
                  <pre innerHTML="${logText(log)}"></pre>
                </div>
              </div>
            </div>

            <!-- BUTTONS -->
            <div class="block block-strong medium-inset no-padding button-block">
              ${!done && !error ? $h`
                <button class="button button-center-content button-large button-fill button-round ${loading ? 'loading' : ''}" style="width: 300px" @click="${createApp}">
                  <i class="icon t4-icons">gear_alt_fill</i>
                  <span>${loading ? 'Creating app...' : 'Create App'}</span>
                </button>
              ` : ''}
              ${done ? $h`
                <button class="button button-center-content button-large button-fill button-round color-green" style="width: 300px">
                  <i class="icon t4-icons">checkmark_alt</i>
                  <span>Done</span>
                </button>
              ` : ''}
              ${error ? $h`
                <button class="button button-center-content button-large button-fill button-round color-red" style="width: 300px">
                  <i class="icon t4-icons">xmark</i>
                  <span>Error</span>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  };
};
