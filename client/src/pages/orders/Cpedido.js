import React, { useState, useEffect } from 'react';
import CashierLayout from '../../components/CashierLayout';
import AdminLayout from '../../components/AdminLayout';
import Modal from './modal'; // Asegúrate de que la ruta sea correcta

function Cpedido() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    Nombre: '',
    Numero: '',
    Direccion: '',
    Metodo: '',
    orderDate: '',
    products: [],
    totalPrice: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);

  // Obtener los pedidos desde el backend
  useEffect(() => {
    fetch('http://localhost:3002/orders')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

    // Verificar el rol del usuario en la sesión
    const userSession = sessionStorage.getItem('usuario');
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol);
    }
  }, []);

  // Filtrar los pedidos según la búsqueda
  useEffect(() => {
    const results = data.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      const matchNombre = order.Nombre?.toLowerCase().includes(searchLower);
      const matchNumero = String(order.Numero).includes(searchQuery);
      const matchDireccion = String(order.Direccion).toLowerCase().includes(searchLower);
      const matchMetodo = String(order.Metodo).toLowerCase().includes(searchLower);
      const matchFecha = order.Fecha?.toLowerCase().includes(searchLower);
      const matchProducts = order.products?.some((product) =>
        product.nombre?.toLowerCase().includes(searchLower)
      );
      const matchTotal = String(order.Total).includes(searchQuery);

      return (
        matchNombre ||
        matchNumero ||
        matchDireccion ||
        matchMetodo ||
        matchFecha ||
        matchProducts ||
        matchTotal
      );
    });
    setFilteredData(results);
  }, [searchQuery, data]);

  const handleAlert = (message, isDelete = false) => {
    setAlertMessage(message);
    setIsDeleteConfirmation(isDelete);
    setShowAlert(true); // Mostrar el modal de alerta
  };

  // Función para cerrar la alerta
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // Iniciar la eliminación del pedido
  const handleDelete = (id) => {
    setConfirmDeleteId(id);
    handleAlert('¿Estás seguro de que deseas eliminar esta orden?', true);
  };

  // Confirmar la desactivación (eliminación lógica) del pedido
  const confirmDeleteOrder = () => {
    fetch(`http://localhost:3002/orders/desactivate/${confirmDeleteId}`, {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok) {
          // Actualiza la UI eliminando el pedido de los estados 'data' y 'filteredData'
          setData((prevData) => prevData.filter((order) => order.id !== confirmDeleteId));
          setFilteredData((prevFilteredData) =>
            prevFilteredData.filter((order) => order.id !== confirmDeleteId)
          );
          setShowAlert(false); // Cerrar el modal de alerta
          setConfirmDeleteId(null); // Limpiar el ID de confirmación
          setAlertMessage('Orden desactivada con éxito.'); // Mensaje de éxito
        } else {
          throw new Error('Error al desactivar la orden');
        }
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setShowAlert(true); // Mostrar error en el modal
      });
  };

  // Editar un pedido
  const handleEdit = (order) => {
    setEditOrder(order);
    setFormData({ ...order });
  };

  // Manejar cambios en el formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Guardar los cambios en el pedido
  const handleSave = () => {
    // Verificar que los campos requeridos estén completos
    if (!formData.Numero || !formData.Direccion || !formData.Metodo) {
      handleAlert('Por favor, completa todos los campos requeridos.');
      return;
    }
  
    // Realizar la actualización en el backend
    fetch(`http://localhost:3002/orders/edit/${formData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Verificar si la respuesta contiene un mensaje de error
        if (data.message) {
          handleAlert(data.message); // Mostrar mensaje de éxito o error
        }
  
        // Si la actualización es exitosa
        if (data.pedido_id) {
          // Actualizar el estado local sin recargar la página
          setData((prevData) =>
            prevData.map((order) =>
              order.id === formData.id ? { ...order, ...formData } : order
            )
          );
          setFilteredData((prevFilteredData) =>
            prevFilteredData.map((order) =>
              order.id === formData.id ? { ...order, ...formData } : order
            )
          );
  
          // Cerrar el modal de edición
          setEditOrder(null); // Esto cierra el modal de edición
  
          // Mostrar la alerta de confirmación de éxito
          setShowAlert(true);
          setAlertMessage('Pedido actualizado exitosamente.');
  
          // Cerrar la alerta después de un tiempo (3 segundos)
          setTimeout(() => {
            setShowAlert(false); // Cerrar el modal de alerta
          }, 3000);
  
          // Forzar la recarga de la página (si lo deseas)
          // window.location.reload(); // Descomenta si deseas hacer un hard refresh
  
          // O puedes optar por sólo actualizar la UI sin recargarla completamente
          // (esto ya se logra con el setData y setFilteredData)
        }
      })
      .catch((error) => {
        // Si ocurre un error, mostrar el mensaje de error
        handleAlert(error.message); // Mostrar mensaje de error
  
        // Asegurarse de cerrar el modal de edición también en caso de error
        setEditOrder(null); // Esto cierra el modal de edición si ocurre un error
      });
  };
  
  
  // Mostrar los productos en un modal
  const handleShowProducts = (products) => {
    setSelectedProducts(products);
    setShowProductsModal(true);
  };

  // Renderizar el layout según el rol del usuario
  const renderLayout = () => {
    if (userRole === 'Administrador') {
      return (
        <AdminLayout>
          {renderProductContent()}
        </AdminLayout>
      );
    } else if (userRole === 'Cajero') {
      return (
        <CashierLayout>
          {renderProductContent()}
        </CashierLayout>
      );
    }
    return null;
  };

  // Renderizar el contenido de los pedidos
  const renderProductContent = () => (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Pedidos</h1>

          <div className="mb-6 text-center">
            <label className="block mb-2">
              Buscar:
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1 block w-1/3 mx-auto border border-gray-300 rounded-lg p-2"
                placeholder="Buscar por nombre, número, dirección..."
              />
            </label>
          </div>

          {/* Formulario de edición */}
          {editOrder && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-2">Editar Orden</h2>
                <form>
                  <label className="block mb-2">
                    Número:
                    <input
                      type="text"
                      name="Numero"
                      value={formData.Numero}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    />
                  </label>
                  <label className="block mb-2">
                    Dirección:
                    <input
                      type="text"
                      name="Direccion"
                      value={formData.Direccion}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    />
                  </label>
                  <label className="block mb-2">
                    Método de Pago:
                    <input
                      type="text"
                      name="Metodo"
                      value={formData.Metodo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    />
                  </label>
                  <label className="block mb-2">
                    Precio Total:
                    <input
                      type="number"
                      name="totalPrice"
                      disabled
                      value={formData.Total}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleSave} // Guardar la orden y cerrar el modal
                    className="bg-blue-500 text-white p-2 rounded-lg mt-4"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditOrder(null)} // Cerrar el modal de edición si se cancela
                    className="bg-gray-500 text-white p-2 rounded-lg mt-4 ml-4"
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Modal para mostrar productos */}
          {showProductsModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-2">Productos en la Orden</h2>
                <ul className="list-disc pl-5 mb-4">
                  {selectedProducts.map((product) => (
                    <li key={product.id} className="mb-1">
                      {product.nombre} - Precio: ${product.precio_unitario} - Cantidad: {product.cantidad}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowProductsModal(false)}
                  className="bg-gray-500 text-white p-2 rounded-lg mt-4"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* Listado de pedidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredData.map((order) => (
              <div key={order.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <h2 className="text-xl font-semibold mb-2">Cliente: {order.Nombre}</h2>
                <p className="text-gray-700 mb-1">Número: {order.Numero}</p>
                <p className="text-gray-700 mb-1">Dirección: {order.Direccion}</p>
                <p className="text-gray-700 mb-1">Método de Pago: {order.Metodo}</p>
                <p className="mb-3">
                   Fecha y Hora: <span className="font-medium">
                  {new Date(order.Fecha).toLocaleString()}
  </span>
</p>

                <p className="font-bold">Total: ${order.Total}</p>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Productos:</h3>
                  <button
                    onClick={() => handleShowProducts(order.products)}
                    className="text-blue-500 underline"
                  >
                    Ver Productos
                  </button>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleEdit(order)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex-1"
                  >
                    Modificar
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {renderLayout()}

      {/* Modal de alerta */}
      {showAlert && (
  <Modal
    isVisible={showAlert}
    message={alertMessage}
    onClose={handleCloseAlert} // Cerrar la alerta
    onConfirm={isDeleteConfirmation ? confirmDeleteOrder : null} // Confirmar la eliminación si es necesario
    isConfirmation={isDeleteConfirmation} // Mostrar el tipo de alerta
  />
)}

    </>
  );
}

export default Cpedido;
