import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import AdminLayout from '../../../components/AdminLayout';
import StoreKeeperLayout from '../../../components/StoreKeeperLayout';

const AdministradorConsultaProductoInactivo = () => {
  const navigate = useNavigate();
  const [inactiveProducts, setInactiveProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [confirmActivate, setConfirmActivate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activationReason, setActivationReason] = useState('');

  const fetchInactiveProducts = async () => {
    try {
      const response = await Axios.get('http://localhost:3002/products/productsInactive');
      setInactiveProducts(response.data);
    } catch (error) {
      console.error('Error fetching inactive products:', error);
    }
  };

  const activateProduct = async () => {
    if (!selectedProduct || !activationReason.trim()) return;

    const userSession = sessionStorage.getItem('usuario');
    const sessionData = userSession ? JSON.parse(userSession) : null;
    const userId = sessionData?.ID;

    if (!userId) {
      alert("No se encontró el ID del usuario.");
      return;
    }

    try {
      const response = await Axios.put(
        `http://localhost:3002/products/activate/${selectedProduct.id}`,
        { description: activationReason, userId }
      );
      console.log("Producto activado:", response.data);

      setInactiveProducts(inactiveProducts.filter(product => product.id !== selectedProduct.id));
      setConfirmActivate(false);
      setSelectedProduct(null);
      setActivationReason('');
    } catch (error) {
      console.error("Error activando producto:", error);
    }
  };

  const openConfirmation = (product) => {
    setSelectedProduct(product);
    setConfirmActivate(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderInactiveProducts = () => (
    <div className="flex flex-col h-full bg-gray-100">
      <main className="flex-grow p-4 overflow-y-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={handleGoBack}
            className="mr-4 flex items-center justify-center w-10 h-10 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors duration-200 shadow-md"
            aria-label="Volver"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <center className="flex-grow">
            <h1 className="text-3xl p-6 bg-gray-700 text-white font-bold rounded-lg shadow-md max-w-md">
              Productos Inactivos
            </h1>
          </center>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {inactiveProducts.length === 0 ? (
            <p>No hay productos inactivos disponibles.</p>
          ) : (
            inactiveProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between min-h-[400px]">
                <div className="relative w-full h-32 bg-gray-200 rounded overflow-hidden">
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2 break-words">{product.nombre}</h2>
                  <p className="text-gray-700 mb-2">Stock: {product.cantidad}</p>
                  <p className="text-gray-700 mb-2">Precio: ${product.precio}</p>
                  <p className="text-gray-700 mb-4 flex-grow break-words">{product.descripcion}</p>
                </div>
                <button
                  onClick={() => openConfirmation(product)}
                  className="mt-4 bg-green-700 text-white py-2 px-4 rounded hover:bg-green-900"
                >
                  Activar Producto
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );

  const renderLayout = () => {
    if (userRole === 'Administrador') {
      return <AdminLayout>{renderInactiveProducts()}</AdminLayout>;
    } else if (userRole === 'Almacenista') {
      return <StoreKeeperLayout>{renderInactiveProducts()}</StoreKeeperLayout>;
    }
    return null;
  };

  useEffect(() => {
    fetchInactiveProducts();
    const userSession = sessionStorage.getItem('usuario');
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol);
    }
  }, []);

  return (
    <>
      {renderLayout()}

      {confirmActivate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              Confirmar Activación de Producto
            </h3>
            <p>Estás por activar el producto: <strong>{selectedProduct?.nombre}</strong></p>
            <div className="mb-4">
              <label
                htmlFor="activationReason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Motivo de Activación
              </label>
              <textarea
                id="activationReason"
                value={activationReason}
                onChange={(e) => setActivationReason(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ingrese el motivo de activación del producto"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmActivate(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={activateProduct}
                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-900 transition"
                disabled={!activationReason.trim()}
              >
                Activar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdministradorConsultaProductoInactivo;