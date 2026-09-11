import HomePage from '../pages/home.js';
import CreatePage from '../pages/create.js';
import AssetsPage from '../pages/assets.js';

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/create/',
    component: CreatePage,
  },
  {
    path: '/assets/',
    component: AssetsPage,
  },
];

export default routes;
