import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import CartIcon from "../pages/CarIcon";

const Header = ({ setSelectedCategory, searchTerm, setSearchTerm, categories = [] }) => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef(null);

  const handleCategoryChange = (category) => {
    // Si no hay una categoría seleccionada, mostrar todos los productos
    if (category.nombre === "Solo Electricos") {
      setSelectedCategory("");  // Restablecer el filtro para mostrar todos los productos
    } else {
      setSelectedCategory(category.nombre);  // Si se selecciona una categoría, aplicar el filtro
    }

    if (window) {
      window.scrollTo({
        top: document.getElementById("productosCliente")?.offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 py-4 shadow-md w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-lg font-bold text-gray-100"
            onClick={() => setSelectedCategory("")}  // Resetear el filtro de categoría
          >
            Solo Electricos
          </Link>

          <div className="flex-grow flex justify-center">
            <input
              type="text"
              placeholder="Buscar producto por nombre"
              className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <CartIcon />

          <div className="relative ml-5" ref={accountDropdownRef}>
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

        <nav className="mt-4 bg-gray-800 py-2 rounded-md">
          <ul className="flex justify-center flex-wrap space-x-2">
            {/* Iterar sobre las categorías disponibles */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category)}
                className="text-gray-100 hover:text-white hover:bg-gray-600 text-m px-2 py-1 transition-colors duration-200"
              >
                {category.nombre}
              </button>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
