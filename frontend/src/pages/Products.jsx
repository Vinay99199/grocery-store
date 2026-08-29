import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Card, CardMedia, CardContent, Typography, TextField, MenuItem, Button, CircularProgress, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'newest'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      params.append('sort', filters.sort);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await api.get(`/products?${params.toString()}`);
      if (response.data.success) {
        setProducts(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold text-gray-800">
        Products
      </Typography>

      {/* Filters */}
      <Box className="bg-white rounded-lg shadow p-6 mb-8">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search Products"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Sort By"
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Products Grid */}
      {loading ? (
        <Box className="flex justify-center items-center min-h-screen">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} className="mb-8">
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow h-full"
                  onClick={() => handleProductClick(product._id)}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      backgroundColor: '#f0f0f0',
                      backgroundImage: product.image
                        ? `url(${product.image})`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" className="truncate font-semibold mb-2">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-2">
                      {product.category.name}
                    </Typography>
                    <Box className="flex items-center justify-between mb-2">
                      <Typography variant="h6" className="text-green-600 font-bold">
                        ₹{product.price}/{product.unit}
                      </Typography>
                      <Rating value={product.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Stock: {product.stock > 0 ? `${product.stock} ${product.unit}` : 'Out of Stock'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box className="flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === pagination.page ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
                >
                  {page}
                </Button>
              ))}
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default Products;
