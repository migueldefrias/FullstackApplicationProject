"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
}

export default function EditProductPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const product: Product = response.data;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock.toString()
        });
      } catch (err: unknown) {
        setError(((err as any)?.response)?.data?.message || 'Erro ao carregar produto');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:3001/products/${productId}`, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      router.push('/products');
    } catch (err: unknown) {
      setError(((err as any)?.response)?.data?.message || 'Erro ao atualizar produto');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando produto...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="mr-4 text-blue-600 hover:text-blue-800"
        >
          ← Voltar
        </button>
        <h1 className="text-2xl font-bold">Editar Produto</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do produto"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descrição do produto"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Preço
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Estoque
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:opacity-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
