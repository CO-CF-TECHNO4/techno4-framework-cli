<template>
  <t4-page name="catalog">
    <t4-navbar title="Catalog"></t4-navbar>
    <t4-list>
      <t4-list-item
        v-for="(product) in products"
        :key="product.id"
        :title="product.title"
        :link="`/product/${product.id}/`"
      ></t4-list-item>
    </t4-list>
    <t4-block v-if="products.length === 3">
      <t4-button fill @click="addProduct">Add Product</t4-button>
    </t4-block>
  </t4-page>
</template>
<script>
  import { useStore } from 'techno4-vue';
  import store from '../js/store'

  export default {
    setup() {
      const products = useStore('products');

      const addProduct = () => {
        store.dispatch('addProduct', {
          id: '4',
          title: 'Apple iPhone 12',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        });
      }

      return {
        products,
        addProduct,
      };
    }
  };
</script>
