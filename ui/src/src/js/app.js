// Import Techno4 Core
import Techno4 from 'techno4';

// Import Techno4 Styles
import 'techno4/css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.less';

// Import Routes
import routes from './routes.js';

// Init Techno4 App
const app = new Techno4({
  el: '#app',
  name: 'Techno4 CLI',
  theme: 'aurora',
  routes,
  view: {
    browserHistory: true,
    browserHistorySeparator: '#!',
  },
  navbar: {
    snapPageScrollToLargeTitle: false,
    snapPageScrollToTransparentNavbar: false,
  },
});

export default app;

