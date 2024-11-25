import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";

const PaginaPrincipal = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const promotions = [
    "https://ferreteriaherkules.com.co/wp-content/uploads/2024/03/banner-herkules-especialista-herramientas.jpg",
    "https://ferreteriaherkules.com.co/wp-content/uploads/2023/05/banner-HK-tienda-ML.jpg",
    "https://ferreteriaherkules.com.co/wp-content/uploads/2023/05/banner-makita-slider-home-promociones.jpg",
  ];

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos y categorías en paralelo
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("http://localhost:3002/products"),
          fetch("http://localhost:3002/products/categories")
        ]);
        
        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    
    // Cambiar las promociones cada 3 segundos
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % promotions.length);
    }, 3000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  // Filtrado de productos por categoría y término de búsqueda
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory 
      ? product.categoria_id === categories.find(cat => cat.nombre === selectedCategory)?.id
      : true;
    
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });


  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Header 
        setSelectedCategory={setSelectedCategory}  // Pasando la función correctamente
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        categories={categories}
      />
      <hr className="mt-4 border-black border-1.5" />

      {/* Sección de promociones */}
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Promociones</h2>
        <div className="relative">
          <img
            src={promotions[currentSlide]}
            alt={`Promoción ${currentSlide + 1}`}
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="absolute inset-0 flex justify-between items-center p-2">
            <button 
              className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length)}
            >
              &#9664; 
            </button>
            <button 
              className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % promotions.length)}
            >
              &#9654;
            </button>
          </div>
        </div>
      </section>

      {/* Sección de productos filtrados */}
      <section className="p-6 flex-grow">
        <h2
          className="text-2xl font-bold mb-6 text-center bg-gray-200 p-3"
          id="productosCliente"
        >
          {selectedCategory ? selectedCategory : "Nuestros productos"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/consultaEspecificaIndex/${product.id}`}
                className="bg-gray-200 p-4 text-center rounded-lg shadow-lg hover:bg-gray-300 cursor-pointer transition flex flex-col justify-between"
              >
                <div className="flex-grow flex flex-col items-center">
                  <div className="w-full h-48 flex justify-center items-center mb-4 overflow-hidden rounded">
                    <img
                      src={product.imagen}
                      alt={`Imagen del producto ${product.id}`}
                      className="w-40 h-40 object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{product.nombre}</h3>
                  <p className="mb-2">{product.descripcion}</p>
                  <p className="mb-2">Cantidad disponible: <span className="font-semibold">{product.cantidad}</span></p>
                </div>
                <p className="text-blue-600 font-semibold mt-2">$ {parseFloat(product.precio).toFixed(2)}</p>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center">
              No se encontraron productos.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PaginaPrincipal;
