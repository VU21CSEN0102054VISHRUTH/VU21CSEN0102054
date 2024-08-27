import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDetail = ({ match }) => {
  const [product, setProduct] = useState(null);
  const { company, category, productName } = match.params;

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://20.244.56.144/test/companies/${company}/categories/${category}/products/top=1&productName=${productName}`);
      setProduct(response.data[0]);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <img src={product.image} alt={product.productName} />
      <h1>{product.productName}</h1>
      <p>Company: {company}</p>
      <p>Category: {category}</p>
      <p>Price: ${product.price}</p>
      <p>Rating: {product.rating}</p>
      <p>Discount: {product.discount}%</p>
      <p>Availability: {product.availability}</p>
    </div>
  );
};

export default ProductDetail;
