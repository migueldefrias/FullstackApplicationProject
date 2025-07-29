"use client";

import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchProducts = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchProduct = async (id: string): Promise<Product | null> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Erro ao carregar produto');
      return null;
    }
  };

  const createProduct = async (productData: ProductFormData): Promise<Product | null> => {
    try {
      const response = await api.post('/products', productData);
      const newProduct = response.data;
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Erro ao criar produto');
      return null;
    }
  };

  const updateProduct = async (id: string, productData: ProductFormData): Promise<Product | null> => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      const updatedProduct = response.data;
      setProducts(prev => prev.map(p => p.id === Number(id) ? updatedProduct : p));
      return updatedProduct;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Erro ao atualizar produto');
      return null;
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Erro ao excluir produto');
      return false;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError
  };
}
