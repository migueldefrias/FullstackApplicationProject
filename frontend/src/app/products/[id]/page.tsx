"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductDetailPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setProduct(response.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token, isAuthenticated, router]);

  const handleDelete = async () => {
    if (!product || !confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await axios.delete(`http://localhost:3001/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/products');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao excluir produto');
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando produto...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="mr-4 text-blue-600 hover:text-blue-800"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()}
            className="mr-4 text-blue-600 hover:text-blue-800"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold">Detalhes do Produto</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/products/${productId}/edit`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <p className="text-lg">{product.id}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <p className="text-lg font-semibold">{product.name}</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <p className="text-gray-800">{product.description}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
            <p className="text-lg font-semibold text-green-600">
              R$ {Number(product.price).toFixed(2)}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
            <p className="text-lg">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.stock > 10 
                  ? 'bg-green-100 text-green-800' 
                  : product.stock > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {product.stock} unidades
              </span>
            </p>
          </div>
          
          {product.createdAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Criado em</label>
              <p className="text-sm text-gray-600">
                {new Date(product.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
          
          {product.updatedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Atualizado em</label>
              <p className="text-sm text-gray-600">
                {new Date(product.updatedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
