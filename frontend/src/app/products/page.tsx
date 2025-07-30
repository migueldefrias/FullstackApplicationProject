"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { api } from "../../lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
}

export default function ProductsPage() {
  const { token, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token, isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={() => router.push("/products/new")}
          >
            + Novo Produto
          </button>
          <button 
            onClick={logout} 
            className="text-sm text-red-600 hover:text-red-800 px-3 py-2 border border-red-300 rounded hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Nenhum produto encontrado</div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={() => router.push("/products/new")}
          >
            Criar Primeiro Produto
          </button>
        </div>
      )}

      {products.length > 0 && (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{product.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.stock > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} un.
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      R$ {Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      Ver
                    </button>
                    <button
                      className="flex-1 bg-yellow-50 text-yellow-600 px-3 py-2 rounded text-sm hover:bg-yellow-100 transition-colors"
                      onClick={() => router.push(`/products/${product.id}/edit`)}
                    >
                      Editar
                    </button>
                    <button
                      className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-100 transition-colors"
                      onClick={async () => {
                        if (confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
                          try {
                            await api.delete(`/products/${product.id}`);
                            setProducts(products.filter((p) => p.id !== product.id));
                          } catch (err: unknown) {
                            const error = err as { response?: { data?: { message?: string } } };
                            setError(error.response?.data?.message || "Erro ao excluir produto");
                          }
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 