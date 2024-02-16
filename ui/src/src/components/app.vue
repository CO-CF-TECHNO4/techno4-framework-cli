<template>
  <t4-app v-bind="t4params">
    <t4-view
      main
      class="ios-edges"
      url="/"
      :browser-history="true"
      browser-history-separator="#!"
    ></t4-view>
  </t4-app>
</template>
<script>
import { t4App, t4View } from 'techno4-vue';
import routes from '../js/routes.js';

export default {
  components: {
    t4App,
    t4View,
  },
  data() {
    return {
      t4params: {
        name: 'Techno4 CLI',
        theme: 'aurora',
        iosTranslucentBars: false,
        routes,
        navbar: {
          snapPageScrollToLargeTitle: false,
          snapPageScrollToTransparentNavbar: false,
        },
      },
    };
  },
};
</script>
