import React, { useState, useEffect } from "react";
import AdministradorActualizarProducto from "./actualizar";
import StoreKeeperLayout from "../../../components/StoreKeeperLayout";
import AdminLayout from "../../../components/AdminLayout";
import Axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"; // Importar las flechas de Heroicons

const AdministradorConsultaProducto = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of products per page
  const [confirmDelete, setConfirmDelete] = useState(false); // Para confirmar la inactivación
  const [productToDelete, setProductToDelete] = useState(null); // Producto a inactivar
  const [inactivationReason, setInactivationReason] = useState("");
  const [categories, setCategories] = useState([]); // Para almacenar las categorías

  const fetchProducts = async () => {
    try {
      const response = await Axios.get("http://localhost:3002/products");
      console.log(response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    const userSession = sessionStorage.getItem("usuario");
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:3002/products/categories"
        );
        setCategories(response.data); // Almacena las categorías en el estado
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setCategoryFilter(selectedCategoryId); // Almacena el ID de la categoría seleccionada
    setCurrentPage(1); // Resetear a la primera página
    filterProducts(selectedCategoryId, minPrice, maxPrice, searchQuery); // Filtrar productos con el ID de la categoría
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    if (name === "minPrice") {
      setMinPrice(value);
    } else {
      setMaxPrice(value);
    }
    filterProducts(
      categoryFilter,
      name === "minPrice" ? value : minPrice,
      name === "maxPrice" ? value : maxPrice,
      searchQuery
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    filterProducts(categoryFilter, minPrice, maxPrice, value);
  };

  const filterProducts = (categoryId, min, max, search) => {
    const filtered = products.filter((product) => {
      const withinCategory = categoryId
        ? product.categoria_id === parseInt(categoryId)
        : true; // Asegúrate de usar el campo categoria_id en lugar de categoriaId
      const withinPriceRange =
        (min === "" || product.precio >= parseFloat(min)) &&
        (max === "" || product.precio <= parseFloat(max));
      const matchesSearch = product.nombre
        .toLowerCase()
        .includes(search.toLowerCase());
      return withinCategory && withinPriceRange && matchesSearch;
    });
    setFilteredProducts(filtered);
  };

  const handleProductUpdate = async () => {
    await fetchProducts();
  };

  const openUpdateForm = (productId) => {
    setSelectedProductId(productId);
    setIsUpdateFormOpen(true);
  };

  const closeUpdateForm = () => {
    setIsUpdateFormOpen(false);
    setSelectedProductId(null);
  };

  // Modificación de la función de inactivación
  const handleProductDelete = async (productId, reason) => {
    console.log("Inactivando producto con ID:", productId); // Verifica que el ID del producto se pase correctamente
    console.log("Motivo de la activación:", reason); // Verifica que el motivo se pase correctamente

    const userSession = sessionStorage.getItem("usuario");
    const sessionData = userSession ? JSON.parse(userSession) : null;
    const userId = sessionData ? sessionData.ID : null; // Usar el ID del usuario actual

    if (!userId) {
      console.error("No se encontro el id del usuario");
      alert("No se encontro el id del usuario.");
      return;
    }
    try {
      const response = await Axios.patch(
        `http://localhost:3002/products/inactivateProduct/${productToDelete}`,
        {
          description: inactivationReason,
          userId: userId,
        }
      );
      console.log("Producto activado:", response.data);
      await fetchProducts();
      setConfirmDelete(false);
      setProductToDelete(null);
      setInactivationReason("");
    } catch (error) {
      console.error("Error inactivating product:", error);
      // Opcional: mostrar mensaje de error al usuario
      if (error.response) {
        alert(error.response.data); // Muestra el mensaje de error del backend
      }
    }
  };

  // Calcular productos por pagina
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Paginacion
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const renderProductContent = () => (
    <div className="flex flex-col  bg-gray-100 p-6">
      <center>
        <h1 className="text-2xl font-bold mb-6">Nuestros productos</h1>
      </center>
      <main className="flex-grow p-4 overflow-y-auto bg-white">
        <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
          {/* Contenedor para los botones "Productos Inactivos", "Registrar Producto" y "Registrar Categoría" */}
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <Link
              to="/registrarProducto"
              className="bg-green-600 text-white p-2 rounded hover:bg-green-800 transition"
            >
              Registrar Producto
            </Link>
            <Link
              to="/productosInactivos"
              className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition"
            >
              Productos Inactivos
            </Link>
            <Link
              to="/registrarCategoria"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-800 transition"
            >
              Categorías
            </Link>
          </div>

          {/* Contenedor para las categorías y búsqueda */}
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <div className="flex items-center w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar producto"
                className="p-2 border border-gray-300 rounded-md w-full sm:w-48" // Ancho ajustado en pantallas pequeñas
              />
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="p-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-48"
              >
                <option value="">Todos los productos</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre} {/* Muestra el nombre de la categoría */}
                  </option>
                ))}
              </select>
            </div>

            {/* Contenedor para los precios */}
            <div className="flex gap-2 items-center">
              <label className="mr-2">Precio:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minPrice"
                  value={minPrice}
                  onChange={handlePriceChange}
                  className="p-2 border border-gray-300 rounded-md w-20" // Ancho reducido
                  placeholder="Min"
                />
                <span className="mx-2">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={maxPrice}
                  onChange={handlePriceChange}
                  className="p-2 border border-gray-300 rounded-md w-20" // Ancho reducido
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between min-h-[400px]"
            >
              <div className="relative w-full h-32 bg-gray-200 rounded overflow-hidden">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2 break-words">
                  {product.nombre}
                </h2>
                <p className="text-gray-700 mb-2">Stock: {product.cantidad}</p>
                <p className="text-gray-700 mb-2">Precio: ${product.precio}</p>
                <p className="text-gray-700 mb-4 flex-grow break-words">
                  {product.descripcion}
                </p>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => openUpdateForm(product.id)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-300 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(true);
                    setProductToDelete(product.id);
                  }}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-300 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Confirmación de eliminación */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">
                Confirmar Inactivación de Producto
              </h3>
              <div className="mb-4">
                <label
                  htmlFor="inactivationReason"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Motivo de Inactivación
                </label>
                <textarea
                  id="inactivationReason"
                  value={inactivationReason}
                  onChange={(e) => setInactivationReason(e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ingrese el motivo de inactivación del producto"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleProductDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  disabled={!inactivationReason.trim()} // Deshabilitar si no hay motivo
                >
                  Inactivar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center items-center mt-6">
          {/* Flecha izquierda (anterior) */}
          <button
            onClick={() =>
              setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
            }
            className="p-2 rounded hover:bg-gray-400 transition"
            aria-label="Página anterior"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
          </button>

          {/* Contenedor central con la información de la página */}
          <div className="text-sm text-gray-700 mx-4">
            Página {currentPage} de {totalPages}
          </div>

          {/* Flecha derecha (siguiente) */}
          <button
            onClick={() =>
              setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
            }
            className="p-2 rounded hover:bg-gray-400 transition"
            aria-label="Página siguiente"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {isUpdateFormOpen && (
          <AdministradorActualizarProducto
            productId={selectedProductId}
            onClose={() => {
              closeUpdateForm();
              handleProductUpdate();
            }}
            userId={JSON.parse(sessionStorage.getItem("usuario")).ID} 
            />
        )}
      </main>
    </div>
  );

  const renderLayout = () => {
    if (userRole === "Administrador") {
      return <AdminLayout>{renderProductContent()}</AdminLayout>;
    } else if (userRole === "Almacenista") {
      return <StoreKeeperLayout>{renderProductContent()}</StoreKeeperLayout>;
    }
    return null;
  };

  return <>{renderLayout()}</>;
};

export default AdministradorConsultaProducto;
