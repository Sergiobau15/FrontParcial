import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CartIcon from '../../CarIcon';
import { useCart } from '../../CartContext'; // Ajusta la ruta según sea necesario

const IndexConsultaEspecifica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart(); // Obtén la función addToCart del contexto

  const filteredRelatedProducts = relatedProducts.filter(prod => prod.id !== product?.id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3002/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch('http://localhost:3002/products');
        const data = await response.json();
        setRelatedProducts(data);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, []);

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
  };

  const handleProductClick = (productId) => {
    navigate(`/consultaEspecificaIndex/${productId}`);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity); // Usa la cantidad del input
      console.log(`Producto ${product.nombre} agregado al carrito con cantidad ${quantity}`);
    }
  };

  if (!product) return <p>Cargando...</p>;

  return (
    <div className="font-sans flex flex-col min-h-screen">
      <header className="bg-gray-800 py-4 shadow-md w-full">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <Link to="/" className="text-lg font-bold text-gray-100">
            Solo Electricos
          </Link>

          <nav className="flex justify-center space-x-4 mt-4 md:mt-0">
            <ul className="flex flex-wrap justify-center space-x-4">
              <li>
                <Link to="/" className="text-gray-100 hover:text-gray-300">
                  Productos
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <CartIcon />
            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center text-gray-100 hover:text-gray-300 focus:outline-none"
              >
                <span>Mi Cuenta</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/registroUsuarioCliente"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Registrarme
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="relative mt-12">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto max-md:px-2">
            <div className="img">
              <div className="img-box h-full max-lg:mx-auto">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="max-lg:mx-auto lg:ml-auto h-80 w-80 object-cover"
                />
              </div>
            </div>
            <div className="data w-full lg:pr-8 pr-0 xl:justify-start justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
              <div className="data w-full max-w-xl">
                <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2 capitalize">{product.nombre}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                  <h6 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 pr-5 sm:border-r border-gray-200 mr-5">
                    $ {parseFloat(product.precio)}
                  </h6>
                  <h4 className="font-manrope font-semibold text-xl leading-9 text-gray-900 pr-5 sm:border-r border-gray-200 mr-5">
                    Disponibles: {parseFloat(product.cantidad)}
                  </h4>
                </div>
                <p className="text-gray-500 text-base font-normal mb-5">
                  {product.descripcion} 
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-8">
                  <div className="flex sm:items-center sm:justify-center w-full">
                    <button
                      onClick={decrementQuantity}
                      className="group py-4 px-6 border border-gray-400 rounded-l-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300"
                    >
                      <svg className="stroke-gray-900 group-hover:stroke-black" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5 11H5.5" stroke="" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      className="font-semibold text-gray-900 cursor-pointer text-lg py-[13px] px-6 w-full sm:max-w-[118px] outline-0 border-y border-gray-400 bg-transparent placeholder:text-gray-900 text-center hover:bg-gray-50"
                      placeholder="1"
                      value={quantity}
                      readOnly
                    />
                    <button
                      onClick={incrementQuantity}
                      className="group py-4 px-6 border border-gray-400 rounded-r-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300"
                    >
                      <svg className="stroke-gray-900 group-hover:stroke-black" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="px-8 py-3 bg-black text-white text-base font-semibold rounded-lg transition-all duration-300 hover:bg-gray-900"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-center">Otros productos...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
          {filteredRelatedProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-gray-200 p-4 text-center cursor-pointer hover:bg-gray-300 transition-all duration-300 rounded-lg shadow-lg"
              onClick={() => handleProductClick(prod.id)}
            >
              <div className="w-full h-32 flex justify-center items-center mb-4 overflow-hidden rounded">
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  className="w-32 h-32 object-cover"
                />
              </div>
              <h3 className="font-bold mb-2">{prod.nombre}</h3>
              <p className="text-blue-600 font-semibold">$ {parseFloat(product.precio)}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-800 text-white p-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Solo Electricos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default IndexConsultaEspecifica;
