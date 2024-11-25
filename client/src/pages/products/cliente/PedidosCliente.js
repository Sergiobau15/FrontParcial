import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import CartIcon from '../../CarIcon';

const MisPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState('');
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // Estado para el modal de error
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        
        if (!usuario) {
            navigate('/login');
            return;
        }

        const fetchPedidos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/pedido');
                const pedidosDelUsuario = response.data.filter(pedido => String(pedido.userId) === String(usuario.id));
                setPedidos(pedidosDelUsuario);
            } catch (error) {
                setError('Error al cargar los pedidos. Intente más tarde.');
                console.error('Error fetching pedidos:', error);
            }
        };

        fetchPedidos();
    }, [navigate]);

    const openModal = (pedido) => {
        setSelectedPedido(pedido);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedPedido(null);
        setShowProductsModal(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/pedido/${id}`);
            setPedidos(pedidos.filter(pedido => pedido.id !== id));
        } catch (error) {
            setError('Error al eliminar el pedido. Intente más tarde.');
            console.error('Error deleting pedido:', error);
        }
    };

    const handleEdit = async () => {
        if (!selectedPedido.Telefono || !selectedPedido.Direccion || !selectedPedido.paymentMethod) {
            setError('Todos los campos son obligatorios.');
            setErrorModalIsOpen(true); // Abre el modal de error
            return;
        }
    
        setError('');
    
        try {
            await axios.put(`http://localhost:3001/pedido/${selectedPedido.id}`, selectedPedido);
            setPedidos(pedidos.map(pedido => (pedido.id === selectedPedido.id ? selectedPedido : pedido)));
            closeModal();
        } catch (error) {
            setError('Error al editar el pedido. Intente más tarde.');
        }
    };

    const formatDate = (dateString) => {
        const parts = dateString.split(', ')[0].split('/');
        const formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T00:00:00`;
        const date = new Date(formattedDate);
        if (isNaN(date)) {
            return "Fecha inválida";
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    const toggleProductsModal = () => {
        setShowProductsModal(!showProductsModal);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('usuario');
        navigate('/');
    };

    return (
        <div>
            <header className="bg-gray-800 py-4 shadow-md w-full">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <Link to="/consultaProductoCliente" className="text-lg font-bold text-gray-100">Solo Electricos</Link>
                        <div className="flex items-center space-x-6">
                            <Link to="/Cart" className="flex items-center text-gray-100 hover:text-gray-300">
                                <CartIcon />
                            </Link>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    id="dropdown-button"
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-2 py-1 text-white hover:bg-gray-300 rounded-md focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                </button>
                                {isDropdownOpen && (
                                    <div id="dropdown-menu" className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                            <button onClick={handleLogout}>Cerrar Sesión</button>
                                        </li>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Mis Pedidos</h2>
                {pedidos.length === 0 ? (
                    <p className="text-center text-gray-600">No tienes pedidos realizados.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {pedidos.map((pedido) => (
                            <div key={pedido.id} className="bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                                <p className="text-gray-500">Nombre: {pedido.Nombres}</p>
                                <p className="text-gray-500">Teléfono: {pedido.Telefono}</p>
                                <p className="text-gray-500">Dirección: {pedido.Direccion}</p>
                                <p className="text-gray-500">Método de Pago: {pedido.paymentMethod}</p>
                                <p className="text-gray-500">Fecha: {formatDate(pedido.orderDate)}</p>
                                <p className="text-gray-700">Total: <span className="font-bold">${parseFloat(pedido.totalPrice).toFixed(2)}</span></p>
                                <p className="text-gray-500 font-semibold">Estado: {pedido.status}</p>
                                <h4 className="font-semibold mt-2 text-gray-600">Productos:</h4>
                                <button
                                    onClick={() => { setSelectedPedido(pedido); toggleProductsModal(); }}
                                    className="text-blue-500 hover:underline mt-2"
                                >
                                    Ver más
                                </button>
                                <div className="mt-4 flex justify-end space-x-4">
                                    <button
                                        onClick={() => openModal(pedido)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-blue-400 hover:text-gray-800"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pedido.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-red-400 hover:text-gray-800"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {modalIsOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-md p-6 w-11/12 md:w-1/3">
                            <h2 className="text-xl font-bold mb-4">Editar Pedido</h2>
                            {selectedPedido && (
                                <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
                                    <label className="block mb-2">
                                        Teléfono:
                                        <input
                                            type="text"
                                            value={selectedPedido.Telefono}
                                            onChange={(e) => setSelectedPedido({ ...selectedPedido, Telefono: e.target.value })}
                                            className="border rounded p-2 w-full"
                                        />
                                    </label>
                                    <label className="block mb-2">
                                        Dirección:
                                        <input
                                            type="text"
                                            value={selectedPedido.Direccion}
                                            onChange={(e) => setSelectedPedido({ ...selectedPedido, Direccion: e.target.value })}
                                            className="border rounded p-2 w-full"
                                        />
                                    </label>
                                    <label className="block mb-2">
                                        Método de Pago:
                                        <select
                                            value={selectedPedido.paymentMethod}
                                            onChange={(e) => setSelectedPedido({ ...selectedPedido, paymentMethod: e.target.value })}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value="">Seleccione un método</option>
                                            <option value="efectivo">Efectivo</option>
                                            <option value="tarjeta">Tarjeta</option>
                                        </select>
                                    </label>
                                    <div className="flex justify-between mt-4">
                                        <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancelar</button>
                                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400">Guardar</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {showProductsModal && selectedPedido && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-md p-6 w-11/12 md:w-1/3">
                            <h2 className="text-xl font-bold mb-4">Productos del Pedido ID: {selectedPedido.id}</h2>
                            <ul>
                                {selectedPedido.products.map((producto) => (
                                    <li key={producto.id} className="text-gray-600">
                                        {producto.nombre} - <span className="font-bold">${parseFloat(producto.precio).toFixed(2)} x {producto.quantityToAdd}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={toggleProductsModal}
                                className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal para mostrar el error */}
                {errorModalIsOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-md p-6 w-11/12 md:w-1/3">
                            <h2 className="text-xl font-bold mb-4">Error</h2>
                            <p className="text-gray-800">{error}</p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setErrorModalIsOpen(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisPedidos;
