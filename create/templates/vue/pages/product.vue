<template>
  <t4-page name="product">
    <t4-navbar :title="product.title" back-link="Back"></t4-navbar>
    <t4-block-title>About {{product.title}}</t4-block-title>
    <t4-block strong>
      {{product.description}}
    </t4-block>
  </t4-page>
</template>
<script>
  import { useStore } from 'techno4-vue';

  export default {
    props: {
      t4route: Object,
    },
    setup(props) {
      const products = useStore('products');
      const productId = props.t4route.params.id;
      let currentProduct;
      products.value.forEach(function (product) {
        if (product.id === productId) {
          currentProduct = product;
        }
      });
      return {
        product: currentProduct,
      };
    },
  };
</script>
