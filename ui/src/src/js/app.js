// Import Vue
import { createApp } from 'vue';

// Import Techno4
import Techno4 from 'techno4/lite';
import Input from 'techno4/components/input';
import Dialog from 'techno4/components/dialog';
import ColorPicker from 'techno4/components/color-picker';
import Popover from 'techno4/components/popover';
import Range from 'techno4/components/range';
import Toggle from 'techno4/components/toggle';
import Popup from 'techno4/components/popup';
import Tooltip from 'techno4/components/tooltip';

// Import Techno4-Vue Plugin
import Techno4Vue, { registerComponents } from 'techno4-vue/bundle';

// Import Techno4 Styles
import 'techno4/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.less';

// Import App Component
import App from '../components/app.vue';

// Init Techno4-Vue Plugin
Techno4.use(Techno4Vue);
Techno4.use([
  Input,
  Dialog,
  ColorPicker,
  Popover,
  Range,
  Toggle,
  Popup,
  Tooltip,
]);

const app = createApp(App);

registerComponents(app);

app.mount('#app');

export default app;
