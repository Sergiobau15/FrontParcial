import React, { useState, useEffect } from 'react';

// Componente para mostrar la página de pedidos del usuario
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Obtener el ID del usuario del sessionStorage
    const user = JSON.parse(sessionStorage.getItem('usuario'));
    if (user) {
      setUserId(user.id);
    }

    // Función para obtener los pedidos desde la API
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/pedido');
        if (!response.ok) {
          throw new Error('Error en la consulta a la API');
        }
        const data = await response.json();

        // Filtrar los pedidos para mostrar solo los que pertenecen al usuario actual
        const userOrders = data.filter(order => order.userId === userId);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 py-4 shadow-md w-full">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="/consultaProductoCliente" className="text-lg font-bold text-white">Solo Electricos</a>
          <nav className="w-1/3 md:flex justify-center">
            <ul className="flex space-x-4">
              <li><a href="/consultaProductoCliente" className="text-white hover:text-gray-300">Inicio</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="flex flex-1 p-4">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold mb-4">Mis Pedidos</h1>
          {orders.length === 0 ? (
            <p className="text-gray-600">No tienes pedidos realizados.</p>
          ) : (
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">ID del Pedido</th>
                  <th className="text-left pb-2">Fecha</th>
                  <th className="text-left pb-2">Total</th>
                  <th className="text-left pb-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4">{order.id}</td>
                    <td className="py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="py-4">${order.totalPrice}</td>
                    <td className="py-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white p-6 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-2">Solo eléctricos</h3>
              <p>Tu tienda de confianza para productos eléctricos.</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-2">Enlaces rápidos</h3>
              <ul>
                <li><a href="/" className="hover:text-gray-300">Inicio</a></li>
                <li><a href="/" className="hover:text-gray-300">Productos</a></li>
                <li><a href="/" className="hover:text-gray-300">Nosotros</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-lg font-bold mb-2">Contacto</h3>
              <p>Email: info@soloelectricos.com</p>
              <p>Teléfono: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p>&copy; 2024 Solo eléctricos. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrdersPage;
