import React from 'react';
import { Page, Navbar, BlockTitle, Block, useStore } from 'techno4-react';

const ProductPage = (props) => {
  const productId = props.t4route.params.id;
  const products = useStore('products');

  var currentProduct;
  products.forEach(function (product) {
    if (product.id === productId) {
      currentProduct = product;
    }
  });
  return (
    <Page name="product">
      <Navbar title={currentProduct.title} backLink="Back" />
      <BlockTitle>About {currentProduct.title}</BlockTitle>
      <Block strong>
        {currentProduct.description}
      </Block>
    </Page>
  );
}

export default ProductPage;
