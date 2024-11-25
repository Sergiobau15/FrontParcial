import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import CartIcon from './CarIcon';
import Modal from './modal';

const CartPage = () => {
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  // Fetch productos y datos del usuario
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3002/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProducts();

    const userData = sessionStorage.getItem('usuario');
    setUser(userData ? JSON.parse(userData) : null);
  }, [navigate]);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const calculateIVA = (subtotal) => {
    return (subtotal * 0.19);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const iva = parseFloat(calculateIVA(subtotal));
    return (subtotal + iva);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    const maxQuantity = products.find(product => product.id === cart[index].id)?.cantidad || 0;

    if (quantity > 0 && quantity <= maxQuantity) {
      const updatedCart = [...cart];
      updatedCart[index].cantidad = quantity;
      setCart(updatedCart);
    }
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const handleCheckout = async () => {
    if (!user) {
      setModalMessage('Por favor, inicie sesión para finalizar la compra.');
      setModalVisible(true);
      navigate('/login');
      return;
    }
  
    if (cart.length === 0) {
      setModalMessage('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
      setModalVisible(true);
      return;
    }
  
    if (!paymentMethod) {
      setModalMessage('Por favor, selecciona un método de pago.');
      setModalVisible(true);
      return;
    }
  
    const totalPrice = calculateTotal();
  
    // Convertir la fecha al formato adecuado
    const fecha = new Date().toISOString(); // Obtiene la fecha en formato ISO 8601
    const formattedDate = fecha.split('T')[0] + ' ' + fecha.split('T')[1].split('.')[0]; // Convertir a formato 'YYYY-MM-DD HH:MM:SS'
  
    const order = {
      nombre: user.Nombres,
      numero: user.Telefono,
      direccion: user.Direccion,
      metodo: paymentMethod, // Método de pago seleccionado
      fecha: formattedDate, // Fecha en formato correcto
      estado: 'Activo', // El estado por defecto, si no cambia
      productos: cart.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        precio_total: item.precio * item.cantidad,
        estado: 'Activo' // El estado por defecto en detalle_pedido
      }))
    };
  
    try {
      // Realizar validación de inventario, etc.
      const response = await fetch('http://localhost:3002/orders/createcar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
  
      if (!response.ok) {
        throw new Error('Error al registrar el pedido');
      }
  
      setCart([]); // Vaciar el carrito
      setModalMessage('Compra finalizada con éxito!');
      setModalVisible(true);
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      setModalMessage(error.message || 'Error al finalizar la compra. Intenta de nuevo.');
      setModalVisible(true);
    }
  };
  
  

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };
  const handleLogout = () => {
    const user = JSON.parse(sessionStorage.getItem('usuario'));
    if (user) {
      setCart([]); // Limpiar el carrito
      localStorage.removeItem(`cart_${user.id}`); // También eliminar del localStorage
    }
    sessionStorage.removeItem('usuario');
    setUser(null);
    navigate('/');
  };
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 py-4 shadow-md w-full">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/consultaProductoCliente" className="text-lg font-bold text-white">Solo Electricos</Link>
          <nav className="hidden md:flex space-x-4">
            <ul className="flex space-x-4">
              <li><Link to="/consultaProductoCliente" className="text-white hover:text-gray-300">Inicio</Link></li>
              <li><Link to="/pedidoCliente" className="text-white hover:text-gray-300">Mis pedidos</Link></li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <CartIcon />
            <div className="relative">
              <button
                id="dropdown-button"
                onClick={toggleDropdown}
                className="flex items-center space-x-2 py-1 text-white hover:bg-gray-300 rounded-md focus:outline-none"
              >
                {user ? (
                  <span>{user.Nombres} {user.Apellidos}</span>
                ) : (
                  <p>No hay sesión activa.</p>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div id="dropdown-menu" className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                  {user ? (
                    <Link to={`/usuarioPerfil/${user.id}`} className='block px-4 py-2 text-gray-700 hover:bg-gray-300'>Mi Perfil</Link>
                  ) : (
                    <p>No hay sesión activa.</p>
                  )}
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                  </li>
                </div>
              )}
            </div>
            <button className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 p-4">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold mb-4">Carrito de compras</h1>
          <div className="flex">
            <div className="w-2/3 pr-8">
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Items</th>
                    <th className="text-left pb-2">Precio</th>
                    <th className="text-left pb-2">Cantidad</th>
                    <th className="text-left pb-2">Disponible</th>
                    <th className="text-left pb-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-600">Tu carrito está vacío.</td>
                    </tr>
                  ) : (
                    cart.map((item, index) => {
                      const product = products.find(p => p.id === item.id);
                      return (
                        <tr key={index}>
                          <td className="py-4">
                            <div className="flex items-center">
                              <img src={item.imagen} alt={item.nombre} className="w-16 h-16 border-2 border-gray-300 mr-4" />
                              <div>
                                <p className="font-bold">{item.nombre}</p>
                                <p className="text-sm text-gray-600">Producto</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">${item.precio}</td>
                          <td className="py-4">
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="1"
                                max={product ? product.cantidad : 1}
                                value={item.cantidad}
                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                className="border p-2 w-20 mx-2"
                              />
                            </div>
                          </td>
                          <td className="py-4">{product ? product.cantidad : 'Cargando...'}</td>
                          <td className="py-4">
                            <button
                              onClick={() => handleRemoveFromCart(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="w-1/3 bg-gray-100 p-4">
              <h2 className="font-bold mb-4">Resumen de la compra</h2>
              <p className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${calculateSubtotal()}</span>
              </p>
              <p className="flex justify-between mb-2">
                <span>IVA (19%)</span>
                <span>${calculateIVA(parseFloat(calculateSubtotal()))}</span>
              </p>
              <p className="flex justify-between font-bold mb-4">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </p>
              <div className="mb-4">
                <label htmlFor="payment-method" className="block text-gray-700">Método de Pago</label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border p-2 w-full"
                >
                  <option value="">Selecciona un método</option>
                  <option value="tarjeta">Tarjeta de Crédito</option>
                  <option value="efectivo">Efectivo</option>
                </select>
              </div>
              <button
                className="w-full bg-blue-500 text-white py-2 rounded mb-2"
                onClick={handleCheckout}
              >
                Finalizar compra
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white p-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Solo Electricos. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Modal para notificaciones */}
      <Modal 
        isVisible={modalVisible} 
        message={<div className="alert alert-success">{modalMessage}</div>} // Estilo para alert
        onClose={() => setModalVisible(false)} 
      />
    </div>
  );
};

export default CartPage;
