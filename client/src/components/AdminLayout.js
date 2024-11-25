import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [productDropdownOpen, setProductDropdownOpen] = useState(false); // Estado para controlar el dropdown de productos

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
                        <h1 className="text-2xl font-bold">Solo electricos Administrador</h1>
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
                                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                        <button onClick={handleLogout}>Cerrar Sesión</button>
                                    </li>
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
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to="/bienvenidaAdministrador" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span className="ms-3">Inicio</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/usuarios" className="flex items-center flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Usuarios</span>
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
                        <li>
                            <Link to="/registroVenta" class="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                                </svg>

                                <span class="flex-1 ms-3 whitespace-nowrap">Ventas</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/rpedido" class="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                </svg>

                                <span class="flex-1 ms-3 whitespace-nowrap">Pedidos</span>
                            </Link>
                        </li>

                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'} pt-16`}>
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

export default AdminLayout;
