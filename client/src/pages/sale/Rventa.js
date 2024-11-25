import React, { useState, useEffect } from 'react';
import Modal from './modal'; // Ajusta la ruta según tu estructura de archivos
import CashierLayout from '../../components/CashierLayout';
import AdminLayout from '../../components/AdminLayout';

const Rventa = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cantidadAgregar, setCantidadAgregar] = useState({});
  const [descuento, setDescuento] = useState('');
  const [metodoPago, setMetodoPago] = useState('Tarjeta');
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
  const [userRole, setUserRole] = useState(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(5); // Inicializamos con 5 productos por página

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3002/products');
        const data = await response.json();
        setProductos(data);
        setProductosFiltrados(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const userSession = sessionStorage.getItem('usuario');
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol); // Asegurarse de que el rol esté guardado bajo la clave 'Rol'
    }

    fetchProductos();
  }, []);

  useEffect(() => {
    if (cantidadAgregar.id) {
      setProductosFiltrados(productos.filter(p => p.nombre.toLowerCase().includes(cantidadAgregar.id.toLowerCase())));
    } else {
      setProductosFiltrados(productos);
    }
  }, [cantidadAgregar.id, productos]);

  const manejarCambioCantidadPorPagina = (e) => {
    const cantidad = parseInt(e.target.value, 10);
    setProductosPorPagina(cantidad);
    setPaginaActual(1); // Resetear a la primera página
  };

  // Lógica de paginación
  const indexOfLastProducto = paginaActual * productosPorPagina;
  const indexOfFirstProducto = indexOfLastProducto - productosPorPagina;
  const productosPaginaActual = productosFiltrados.slice(indexOfFirstProducto, indexOfLastProducto);

  const totalPages = Math.ceil(productosFiltrados.length / productosPorPagina);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setCantidadAgregar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarProducto = (producto) => {
    const cantidad = parseInt(cantidadAgregar[producto.id] || 0, 10);

    if (cantidad <= 0) {
      setModal({
        isOpen: true,
        title: 'Cantidad Inválida',
        message: 'Ingrese una cantidad válida.'
      });
      return;
    }

    if (cantidad > producto.cantidad) {
      setModal({
        isOpen: true,
        title: 'Cantidad Excedida',
        message: `No puede agregar más de ${producto.cantidad} unidades de este producto.` // Corregido
      });
      return;
    }

    const productoExistente = productosAgregados.find(p => p.id === producto.id);
    if (productoExistente) {
      setProductosAgregados(productosAgregados.map(p =>
        p.id === producto.id
          ? { ...p, cantidad: p.cantidad + cantidad }
          : p
      ));
    } else {
      setProductosAgregados([
        ...productosAgregados,
        { ...producto, cantidad }
      ]);
    }

    setCantidadAgregar(prev => ({ ...prev, [producto.id]: 0 }));
  };
  const registrarVenta = async () => {
    if (productosAgregados.length === 0) {
      setModal({
        isOpen: true,
        message: 'Debe agregar al menos un producto.',
        isConfirmation: false
      });
      return;
    }
  
    try {
      const userSession = sessionStorage.getItem('usuario');
      const sessionData = userSession ? JSON.parse(userSession) : null;
      const usuario_id = sessionData ? sessionData.ID : null; // Cambié a sessionData.ID
  
      if (!usuario_id) {
        setModal({
          isOpen: true,
          message: 'No se pudo obtener el usuario para registrar la venta.',
          isConfirmation: false
        });
        return;
      }
  
      const venta = {
        usuario_id: usuario_id,
        productos: productosAgregados.map(producto => ({
          id: producto.id,
          nombre: producto.nombre,
          cantidad: producto.cantidad,
          precio: producto.precio,
          subtotal: producto.cantidad * producto.precio
        })),
        descuento: parseFloat(descuento) || 0,
        metodo_pago: metodoPago,
        total: calcularTotal(),
        fechaHora: obtenerFechaHora()
      };
  
      console.log("Datos de la venta a enviar:", venta);
  
      const response = await fetch('http://localhost:3002/sale/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venta)
      });
  
      if (!response.ok) {
        throw new Error('Error al registrar la venta');
      }
  
      // Recargar productos después de registrar la venta
      await fetchProductos();  // Llamada para actualizar los productos
  
      setModal({
        isOpen: true,
        message: 'Venta registrada con éxito.',
        isConfirmation: false
      });
  
      // Limpiar estado después de la venta
      setProductosAgregados([]);
      setDescuento('');
      setMetodoPago('Tarjeta');
      setCantidadAgregar({});
    } catch (error) {
      setModal({
        isOpen: true,
        message: 'Error al registrar la venta. Intenta nuevamente.',
        isConfirmation: false
      });
      console.error('Error al registrar la venta:', error);
    }
  };
  
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:3002/products');
      const data = await response.json();
      setProductos(data); // Actualiza el estado de productos
      setProductosFiltrados(data); // También actualiza los productos filtrados
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  

  const manejarCambioCantidad = (productoId, nuevaCantidad) => {
    const cantidad = parseInt(nuevaCantidad, 10);
    if (cantidad <= 0) {
      eliminarProducto(productoId);
      return;
    }

    setProductosAgregados(productosAgregados.map(p =>
      p.id === productoId
        ? { ...p, cantidad }
        : p
    ));
  };

  const eliminarProducto = (productoId) => {
    setProductosAgregados(productosAgregados.filter(p => p.id !== productoId));
  };

  const calcularSubtotal = () => {
    return productosAgregados.reduce((acc, producto) => acc + producto.cantidad * producto.precio, 0);
  };

  const calcularIVA = () => {
    return calcularSubtotal() * 0.19;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA() - (parseFloat(descuento) || 0);
  };

  const obtenerFechaHora = () => {
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = String(now.getMonth() + 1).padStart(2, '0');
    const ano = now.getFullYear();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    return `${dia}-${mes}-${ano} ${horas}:${minutos}`; // Corregido
  };

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

  const renderProductContent = () => (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 mt-6 text-center">Productos</h1>
      <main className="flex-1 p-10">
        <div className="mb-6">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <select
              className="ml-4 border-r p-2"
              value={productosPorPagina}
              onChange={manejarCambioCantidadPorPagina}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>

            <input
              type="text"
              name="id"
              placeholder="Buscar producto por nombre"
              className="border-0 p-2 w-full focus:outline-none"
              value={cantidadAgregar.id || ''}
              onChange={manejarCambio}
            />
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Cantidad</th>
              <th className="border border-gray-300 p-2">Cantidad a Agregar</th>
              <th className="border border-gray-300 p-2">Precio</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginaActual.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No hay productos disponibles</td>
              </tr>
            ) : (
              productosPaginaActual.map((producto) => (
                <tr key={producto.id}>
                  <td className="border border-gray-300 p-2">{producto.id}</td>
                  <td className="border border-gray-300 p-2">{producto.nombre}</td>
                  <td className="border border-gray-300 p-2">{producto.cantidad}</td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      name={producto.id}
                      placeholder="Cantidad a agregar"
                      className="border p-1 w-full"
                      value={cantidadAgregar[producto.id] || ''}
                      onChange={manejarCambio}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">{producto.precio}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => agregarProducto(producto)}
                    >
                      Agregar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-center items-center mb-6">
          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
            className="bg-gray-300 px-4 py-2 rounded-l"
          >
            &lt;
          </button>

          <span className="px-4 text-lg">
            Página {paginaActual} de {totalPages}
          </span>

          <button
            disabled={paginaActual === totalPages}
            onClick={() => setPaginaActual(paginaActual + 1)}
            className="bg-gray-300 px-4 py-2 rounded-r"
          >
            &gt;
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Productos Agregados</h2>
        {productosAgregados.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Nombre</th>
                <th className="border border-gray-300 p-2">Cantidad</th>
                <th className="border border-gray-300 p-2">Precio</th>
                <th className="border border-gray-300 p-2">Subtotal</th>
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosAgregados.map((producto) => (
                <tr key={producto.id}>
                  <td className="border border-gray-300 p-2">{producto.id}</td>
                  <td className="border border-gray-300 p-2">{producto.nombre}</td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number" disabled
                      value={producto.cantidad}
                      onChange={(e) => manejarCambioCantidad(producto.id, e.target.value)}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">{producto.precio}</td>
                  <td className="border border-gray-300 p-2">{producto.cantidad * producto.precio}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay productos agregados aún.</p>
        )}

        <div className="flex flex-col mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="mr-4">
              <label htmlFor="descuento" className="block text-lg font-semibold text-gray-700">Descuento</label>
              <input
                id="descuento"
                type="number"
                value={descuento}
                onChange={(e) => setDescuento(e.target.value)}
                className="border p-3 w-full text-lg"
                placeholder="0"
              />
            </div>
            <div className="mr-4">
              <label htmlFor="metodoPago" className="block text-lg font-semibold text-gray-700">Método de Pago</label>
              <select
                id="metodoPago"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="border p-3 w-full text-lg"
              >
                <option value="Tarjeta">Tarjeta</option>
                <option value="Efectivo">Efectivo</option>
              </select>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">Subtotal: ${calcularSubtotal()}</p>
              <p className="text-lg font-semibold text-gray-700">IVA (19%): ${calcularIVA()}</p>
              <p className="text-lg font-semibold text-gray-700">Total: ${calcularTotal()}</p>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mb-4 md:mr-2"
              onClick={registrarVenta}
            >
              Registrar Venta
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4 md:mr-2"
              onClick={() => window.location.href = '/user/cventa'}
            >
              Consultar Ventas
            </button>
          </div>
        </div>
      </main>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ isOpen: false })}
      />
    </div>
  );

  return (
    <>
      {renderLayout()}
    </>
  );
};

export default Rventa;
