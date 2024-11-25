import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CashierLayout from '../../components/CashierLayout';
import Modal from "../modal";
import Axios from "axios";

// Componente de registro de pedido
const App = (props) => {
  const {
    formData, setFormData, availableProducts, currentProducts,
    tempQuantity, handleQuantityChange, handleProductAdd, orderedProducts,
    handleRemoveProduct, getTotalPrice, getTotalPriceWithIVA, addOrder,
    setProductsPerPage, productsPerPage, searchTerm, setSearchTerm,
    currentPage, totalPages, setCurrentPage
  } = props;

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    addOrder();
  };

  return (
// Dentro del componente 'App' en el render
<div className="flex min-h-screen">
  <main className="flex-1 p-8">
    <h1 className="text-2xl font-bold mb-6 text-center">Registrar Pedido</h1>
    <form onSubmit={handleOrderSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Formulario de entrada */}
        <div>
          <label htmlFor="Nombres" className="block mb-2">Nombres</label>
          <input
            type="text"
            id="Nombres"
            name="Nombres"
            value={formData.Nombres}
            onChange={(e) => setFormData({ ...formData, Nombres: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="num" className="block mb-2">Número</label>
          <input
            type="number"
            id="num"
            name="num"
            value={formData.num}
            onChange={(e) => setFormData({ ...formData, num: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="adress" className="block mb-2">Dirección</label>
          <input
            type="text"
            id="adress"
            name="adress"
            value={formData.adress}
            onChange={(e) => setFormData({ ...formData, adress: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="paymentMethod" className="block mb-2">Método de Pago</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="nada">Seleccione el Metodo</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>
      </div>

      {/* Productos */}
      <div className="mb-6 flex flex-col items-center">
  <h2 className="mb-2 text-lg font-semibold">Productos</h2>
  <div className="flex items-center border border-gray-300 rounded-lg w-full">
    <select
      className="ml-4 border-r p-2 w-16" // Ahora el select es aún más pequeño (w-16)
      value={productsPerPage}
      onChange={(e) => setProductsPerPage(parseInt(e.target.value))}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
        <option key={num} value={num}>{num}</option>
      ))}
    </select>

    <input
      type="text"
      name="id"
      placeholder="Buscar producto por nombre"
      className="border-0 p-2 w-full focus:outline-none" // El input ocupa el espacio restante
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  <table className="min-w-full bg-white border mt-4">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponible</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {currentProducts.map((product) => (
        <tr key={product.id}>
          <td className="px-6 py-4 whitespace-nowrap">{product.nombre}</td>
          <td className="px-6 py-4 whitespace-nowrap">${product.precio}</td>
          <td className="px-6 py-4 whitespace-nowrap">{product.cantidad}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <input
              type="number"
              value={tempQuantity[product.id] || ""}
              onChange={(e) => handleQuantityChange(e, product.id)}
              className="border border-gray-300 rounded-md px-2 py-1 w-16"
            />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <button
              type="button"
              onClick={() => handleProductAdd(product)}
              className="text-blue-500 hover:text-blue-600"
            >
              Añadir
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Paginación */}
  <div className="flex justify-between items-center mt-6">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="bg-gray-300 px-4 py-2 rounded"
    >
      &lt;
    </button>

    <span className="text-lg">
      Página {currentPage} de {totalPages}
    </span>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="bg-gray-300 px-4 py-2 rounded"
    >
      &gt;
    </button>
  </div>
</div>

      {/* Productos Añadidos */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Productos Añadidos</h2>
        <ul>
          {orderedProducts.map((product, index) => (
            <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>{product.nombre} (x{product.quantityToAdd})</span>
              <button
                type="button"
                onClick={() => handleRemoveProduct(index)}
                className="text-red-500 hover:text-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <p>Subtotal: ${getTotalPrice()}</p>
          <p>IVA (19%): ${getTotalPrice() * 0.19}</p>
          <p>Total: ${getTotalPriceWithIVA()}</p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button type="submit" className="px-6 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600">
          Registrar Pedido
        </button>
        <button
          type="button"
          className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-600"
          onClick={() => props.navigate("/user/cpedido")} // Redirige directamente al consultar pedido
        >
          Consultar Pedidos
        </button>
      </div>
    </form>
  </main>
</div>
  );
};

// Componente principal de Rpedido
const Rpedido = () => {
  const navigate = useNavigate();  // Hook de navegación
  const [formData, setFormData] = useState({
    Nombres: "",
    num: "",
    adress: "",
    paymentMethod: "",
  });
  const [availableProducts, setAvailableProducts] = useState([]);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [tempQuantity, setTempQuantity] = useState({});
  const [productsPerPage, setProductsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await Axios.get("http://localhost:3002/products");
      setAvailableProducts(response.data);
      setTotalPages(Math.ceil(response.data.length / productsPerPage));
      setCurrentPage(1); // Resetear a la primera página al cargar productos
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(availableProducts.length / productsPerPage));
    setCurrentPage(1); // Resetear a la primera página si cambia la cantidad de productos por página
  }, [availableProducts, productsPerPage]);

  const filteredProducts = availableProducts.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleQuantityChange = (e, productId) => {
    setTempQuantity({
      ...tempQuantity,
      [productId]: e.target.value,
    });
  };

  const handleProductAdd = (product) => {
    const quantityToAdd = parseInt(tempQuantity[product.id]) || 1;

    if (quantityToAdd > product.cantidad) {
      alert(`No se puede agregar más de ${product.cantidad} unidades de ${product.nombre}`);
      return;
    }

    if (quantityToAdd > 0) {
      setOrderedProducts([...orderedProducts, { ...product, quantityToAdd }]);
      setTempQuantity({
        ...tempQuantity,
        [product.id]: "",
      });
    }
  };

  const handleRemoveProduct = (index) => {
    const newProducts = [...orderedProducts];
    newProducts.splice(index, 1);
    setOrderedProducts(newProducts);
  };

  const getTotalPrice = () => {
    return orderedProducts.reduce((acc, product) => acc + product.precio * product.quantityToAdd, 0);
  };

  const getTotalPriceWithIVA = () => {
    return getTotalPrice() * 1.19;
  };

  const addOrder = async () => {
    if (!formData.Nombres || !formData.num || !formData.adress || !formData.paymentMethod) {
      alert("Por favor, complete todos los campos del formulario.");
      return;
    }

    if (orderedProducts.length === 0) {
      alert("Por favor, agregue productos al pedido.");
      return;
    }

    const productos = orderedProducts.map((product) => ({
      producto_id: product.id,
      cantidad: product.quantityToAdd,
      precio_unitario: product.precio,
    }));

    try {
      await Axios.post("http://localhost:3002/orders/create", {
        nombre: formData.Nombres,
        numero: formData.num,
        direccion: formData.adress,
        metodo: formData.paymentMethod,
        productos: productos,
      });

      setFormData({
        Nombres: "",
        num: "",
        adress: "",
        paymentMethod: "",
      });
      setOrderedProducts([]);
      fetchProducts();  // Recargar productos
      alert("Pedido registrado con éxito");
    } catch (error) {
      console.error("Error al registrar el pedido:", error);
      alert("Error al registrar el pedido");
    }
  };

  return (
    <CashierLayout>
      <App
        formData={formData}
        setFormData={setFormData}
        availableProducts={availableProducts}
        currentProducts={currentProducts}
        tempQuantity={tempQuantity}
        handleQuantityChange={handleQuantityChange}
        handleProductAdd={handleProductAdd}
        orderedProducts={orderedProducts}
        handleRemoveProduct={handleRemoveProduct}
        getTotalPrice={getTotalPrice}
        getTotalPriceWithIVA={getTotalPriceWithIVA}
        addOrder={addOrder}
        setProductsPerPage={setProductsPerPage}
        productsPerPage={productsPerPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        navigate={navigate}  // Pasar navigate a App
      />
      <Modal isVisible={false} message="" onClose={() => {}} />
    </CashierLayout>
  );
};

export default Rpedido;
