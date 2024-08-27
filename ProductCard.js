import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div>
      <img src={product.image} alt={product.productName} />
      <h2>{product.productName}</h2>
      <p>Price: ${product.price}</p>
      <p>Rating: {product.rating}</p>
      <p>Discount: {product.discount}%</p>
      <p>Availability: {product.availability}</p>
    </div>
  );
};

export default ProductCard;
