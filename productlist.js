import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; // Component for displaying each product

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: '', company: '', rating: 0, minPrice: 0, maxPrice: 10000, availability: '' });
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://20.244.56.144/test/companies/${filters.company}/categories/${filters.category}/products/top=10&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`);
      const sortedProducts = sortProducts(response.data, sortBy);
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const sortProducts = (products, sortBy) => {
    return products.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discount - a.discount;
      return 0;
    });
  };

  return (
    <div>
      {/* Filter and Sorting UI */}
      {/* Display Products */}
      {products.map(product => (
        <ProductCard key={product.productName} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
