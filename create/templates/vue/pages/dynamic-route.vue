<template>
  <t4-page>
    <t4-navbar title="Dynamic Route" back-link="Back"></t4-navbar>
    <t4-block strong>
      <ul>
        <li><b>Url:</b> {{t4route.url}}</li>
        <li><b>Path:</b> {{t4route.path}}</li>
        <li><b>Hash:</b> {{t4route.hash}}</li>
        <li><b>Params:</b>
          <ul>
            <li v-for="(value, key) in t4route.params" :key="key"><b>{{key}}:</b> {{value}}</li>
          </ul>
        </li>
        <li><b>Query:</b>
          <ul>
            <li v-for="(value, key) in t4route.query" :key="key"><b>{{key}}:</b> {{value}}</li>
          </ul>
        </li>
        <li><b>Route:</b> {{t4route.route.path}}</li>
      </ul>
    </t4-block>
    <t4-block strong>
      <t4-link @click="t4router.back()">Go back via Router API</t4-link>
    </t4-block>
  </t4-page>
</template>
<script>
  export default {
    props: {
      t4route: Object,
      t4router: Object,
    },
  };
</script>
