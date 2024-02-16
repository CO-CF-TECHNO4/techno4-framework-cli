<template>
  <t4-page>
    <t4-navbar :title="`${user.firstName} ${user.lastName}`" back-link="Back"></t4-navbar>
    <t4-block strong>
      {{user.about}}
    </t4-block>
    <t4-list>
      <t4-list-item
        v-for="(link, index) in user.links"
        :key="index"
        :link="link.url"
        :title="link.title"
        external
        target="_blank"
      ></t4-list-item>
    </t4-list>
  </t4-page>
</template>
<script>
  export default {
    props: {
      user: Object,
    }
  }
</script>
