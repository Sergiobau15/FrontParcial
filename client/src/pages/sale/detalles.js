import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function DetallesVenta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetch(`http://localhost:3001/venta/${id}`)
      .then(response => response.json())
      .then(details => {
        setOrderDetails(details);
      })
      .catch(error => {
        setError(error);
      });
  }, [id]);


  const handleBack = () => {
    navigate('/user/cventa'); // Redirige a la vista de ventas, ajusta la ruta si es necesario
  };


  if (error) return <p className="text-center text-lg text-red-600">Error: {error.message}</p>;


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="p-6 flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Detalles de la Venta</h1>


        {orderDetails ? (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-300 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Venta ID: {orderDetails.id}</h2>
            {orderDetails.productos && orderDetails.productos.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-200">Producto</th>
                    <th className="border p-2 bg-gray-200">Cantidad</th>
                    <th className="border p-2 bg-gray-200">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.productos.map(product => (
                    <tr key={product.id}>
                      <td className="border p-2">{product.nombre}</td>
                      <td className="border p-2 text-center">{product.cantidad}</td>
                      <td className="border p-2 text-right">${product.precio.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay productos en esta venta.</p>
            )}
            <div className="mt-6 text-center">
              <button
                onClick={handleBack}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              >
                Volver
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg">Cargando detalles...</p>
        )}
      </main>

    </div>
  );
}


export default DetallesVenta;
