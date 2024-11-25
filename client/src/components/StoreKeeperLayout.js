import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';

const StoreKeeperLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [productDropdownOpen, setProductDropdownOpen] = useState(false);

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('usuario');
        navigate('/')

    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem('usuario');

        if (!storedUser) {
            if (!alertShown) {
                alert('Debe iniciar sesión primero');
                alertShown = true; // Marcar que ya se mostró el alert
            }
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
            setIsLoading(false);
        }
    }, [navigate]);


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleProductDropdown = () => {
        setProductDropdownOpen(!productDropdownOpen); // Función para alternar el dropdown de productos
    };

    if (isLoading) {
        return null;
    }
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 z-30">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="mr-4" aria-label="Toggle Sidebar">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Solo electricos Almacenista</h1>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center space-x-2">
                            {user ? (
                                <span>{user.Nombres} {user.Apellidos}</span>
                            ) : (
                                <p>No hay sesión activa.</p>
                            )}
                            <User size={24} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                                <ul>
                                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                        {user ? (
                                            <Link to={`/usuarioPerfil/${user.id}`}>Mi Perfil</Link>
                                        ) : (
                                            <p>No hay sesión activa.</p>
                                        )}
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer"><button onClick={handleLogout} >Cerrar Sesión</button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`bg-gray-800 text-white w-64 fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex justify-end p-4">
                    <button onClick={toggleSidebar} aria-label="Close Sidebar">
                        <X size={24} />
                    </button>
                </div>
                <nav className="mt-4">
                    <ul class="space-y-2 font-medium">
                        <li>
                            <Link to="/bienvenidaAlmacenista" class="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>

                                <span class="ms-3">Inicio</span>
                            </Link>
                        </li>
                        <li>
                            <button
                                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                                onClick={toggleProductDropdown}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Productos</span>
                                <ChevronDown size={20} />
                            </button>
                            {productDropdownOpen && (
                                <ul className="pl-6 space-y-2">
                                    <li>
                                        <Link to="/registrarProducto" className="block text-white hover:bg-gray-700 p-2 rounded-lg">
                                            Registrar Producto
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/consultaProducto" className="block text-white hover:bg-gray-700 p-2 rounded-lg">
                                            Consultar Productos
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'
                } pt-16`}>
                {children}
            </main>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

let alertShown = false;

export default StoreKeeperLayout;
