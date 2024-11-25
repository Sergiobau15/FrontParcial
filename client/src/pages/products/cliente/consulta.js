import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartIcon from '../../CarIcon';

const ClienteConsulta = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const productsSectionRef = useRef(null);

  const promotions = [
    "https://ferreteriaherkules.com.co/wp-content/uploads/2024/03/banner-herkules-especialista-herramientas.jpg",
    "https://ferreteriaherkules.com.co/wp-content/uploads/2023/05/banner-HK-tienda-ML.jpg",
    "https://ferreteriaherkules.com.co/wp-content/uploads/2023/05/banner-makita-slider-home-promociones.jpg",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos y categorías en paralelo
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('http://localhost:3002/products'),
          fetch('http://localhost:3002/products/categories')
        ]);
        
        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        setProducts(productsData);
        setCategories(categoriesData);
        console.log('Fetched products:', productsData);
        console.log('Fetched categories:', categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % promotions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario');

    if (!storedUser) {
      navigate('/login');
    } else {
      const user = JSON.parse(storedUser);
      setUser(user);
      setIsLoading(false);
      console.log('User ID:', user.id);
    }
  }, [navigate]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory 
      ? product.categoria_id === categories.find(cat => cat.nombre === selectedCategory)?.id
      : true;
    
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('usuario');
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.nombre);
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const showAllProducts = () => {
    setSelectedCategory('');
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="font-sans flex flex-col min-h-screen">
      <header className="bg-gray-800 py-4 shadow-md w-full">
        <div className="container mx-auto px-4 flex items-center">
          <Link to="/consultaProductoCliente" className="text-lg font-bold text-white mr-4" onClick={showAllProducts}>
            Solo Electricos
          </Link>
          <div className="flex flex-grow justify-center mx-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full max-w-xs py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <nav className="ml-4">
            <ul className="flex space-x-4">
              <li><Link to="/pedidoCliente" className="text-white hover:text-gray-300">Mis Pedidos</Link></li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4 ml-4">
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
        <nav className="mt-4 bg-gray-800 py-2 rounded-md">
          <ul className="flex justify-center flex-wrap space-x-2">
            {categories.map((category) => (
              <li key={category.id} className="mb-2">
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="text-gray-100 hover:text-white hover:bg-gray-600 text-m px-4 py-2 rounded transition-colors duration-200"
                >
                  {category.nombre}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <hr className="mt-4 border-black border-1.5" />

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

      <section className="p-6 flex-grow" ref={productsSectionRef}>
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
                to={`/consultaEspecificaCliente/${product.id}`}
                className="bg-gray-200 p-4 text-center rounded-lg shadow-lg hover:bg-gray-300 cursor-pointer transition"
              >
                <div className="w-full h-48 flex justify-center items-center mb-4 overflow-hidden rounded">
                  <img
                    src={product.imagen}
                    alt={`Imagen del producto ${product.nombre}`}
                    className="w-40 h-40 object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold mb-2">{product.nombre}</h3>
                <p className="mb-2">{product.descripcion}</p>
                <p className="mb-2">Cantidad disponible: <span className="font-semibold">{product.cantidad}</span></p>
                <p className="text-blue-600 font-semibold">$ {parseFloat(product.precio)}</p>
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

export default ClienteConsulta;