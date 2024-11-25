import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CashierLayout from '../../components/CashierLayout';
import AdminLayout from '../../components/AdminLayout';

function Cventa() {
  const [data, setData] = useState([]);  // Inicializa data como un array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [selectedOrder, setSelectedOrder] = useState(null); // Estado para los detalles de la orden
  const navigate = useNavigate();

  // UseEffect para obtener los datos iniciales de la API
  useEffect(() => {
    // Función para obtener los datos de la venta
    const fetchData = () => {
      fetch('http://localhost:3002/sale/all')
        .then(response => response.json())
        .then(data => {
          console.log("Datos de la respuesta:", data); // Verifica que `data` sea un array
          if (Array.isArray(data)) {
            setData(data); // Si es un arreglo, lo asignamos a 'data'
          } else {
            setError('La respuesta no es un array.');
          }
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    };

    fetchData(); // Llamar a la función para obtener los datos

    // Revisa el rol del usuario desde la sesión
    const userSession = sessionStorage.getItem('usuario');
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol);
    }

    // Intervalo para actualizar los datos cada 5 segundos
    const intervalId = setInterval(fetchData, 5000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Abrir el modal con los detalles de la venta seleccionada
  const handleViewDetails = (order) => {
    setSelectedOrder(order);  // Establecer la orden seleccionada
    setIsModalOpen(true);  // Abrir el modal
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Cerrar el modal
    setSelectedOrder(null); // Limpiar los detalles
  };

  // Filtrado de datos de acuerdo al término de búsqueda
  const filteredData = data.filter(order =>
    Object.values(order).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Renderizar contenido principal de ventas
  const renderProductContent = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="p-6 flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Datos de Ventas</h1>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Buscar:
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Escribe para buscar..."
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {filteredData.length === 0 && !loading && !error && (
          <p className="text-center text-lg text-gray-500">No se encontraron resultados.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredData.map((order) => (
            <div key={order.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">ID: {order.id}</h2>
              <div className="text-gray-700 mb-2">
                <p className="mb-1">Descuento: <span className="font-medium">${order.descuento}</span></p>
                <p className="mb-1">Subtotal: <span className="font-medium">${order.subtotal}</span></p>
                <p className="mb-1">Total: <span className="font-medium">${order.total}</span></p>
                <p className="mb-1">Método de Pago: <span className="font-medium">{order.metodo_pago}</span></p>
                <p className="mb-3">
                  Fecha y Hora: <span className="font-medium">
                  {new Date(order.fecha_hora).toLocaleString()}
  </span>
</p>

                <button
                  onClick={() => handleViewDetails(order)} // Pasar la orden completa al hacer clic
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                  Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  // Renderizar el modal con los detalles de la venta seleccionada
  const renderModal = () => (
    isModalOpen && selectedOrder && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-2xl font-semibold mb-4">Detalles de la Venta</h2>

          <h3 className="mt-6 font-semibold text-lg">Productos:</h3>
          <table className="min-w-full mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Producto</th>
                <th className="px-4 py-2 border">Precio Unitario</th>
                <th className="px-4 py-2 border">Cantidad</th>
                <th className="px-4 py-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.productos && selectedOrder.productos.map((product, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{product.nombre}</td>
                  <td className="px-4 py-2 border">${product.precio_unitario.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{product.cantidad}</td>
                  <td className="px-4 py-2 border">${product.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-right">
            <button
              onClick={handleCloseModal} // Cerrar el modal
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Renderizar el layout basado en el rol del usuario
  const renderLayout = () => {
    if (userRole === 'Administrador') {
      return (
        <AdminLayout>
          {renderProductContent()}
          {renderModal()}
        </AdminLayout>
      );
    } else if (userRole === 'Cajero') {
      return (
        <CashierLayout>
          {renderProductContent()}
          {renderModal()}
        </CashierLayout>
      );
    }
    return null;
  };

  // Mostrar mensajes de carga o error
  if (loading) return <p className="text-center text-lg">Cargando...</p>;
  if (error) return <p className="text-center text-lg text-red-600">Error: {error.message}</p>;

  return (
    <>{renderLayout()}</>
  );
}

export default Cventa;
