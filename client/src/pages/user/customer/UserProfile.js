import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const UserProfile = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [originalData, setOriginalData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await fetch(`http://localhost:3001/users/${userId}`);
                    const data = await response.json();
                    setUserData({
                        name: data.name,
                        email: data.email,
                        password: ''
                    });
                    setOriginalData(data);
                } catch (error) {
                    console.error('Error:', error);
                    setError('Error al cargar los datos del usuario.');
                }
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!userData.name || !userData.email || !userData.password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            const updatedData = {
                ...originalData, // Mantén los datos originales
                name: userData.name,
                email: userData.email,
                password: userData.password
            };

            await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            alert('Datos actualizados correctamente');
            navigate('/user/customer/welcome');
        } catch (error) {
            console.error('Error:', error);
            setError('Error al actualizar los datos.');
        }
    };

    return (
        <div>
            <header className="bg-gray-800 py-4 shadow-md w-full">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <a href="/" className="text-lg font-bold text-gray-100">Solo Electricos</a>
                    <nav className="hidden md:flex space-x-4">
                        <ul className="flex space-x-4">
                            <li><Link to="/user/customer/welcome" className="text-gray-100 hover:text-gray-300">Inicio</Link></li>
                            <li><a href="./Productos/Cliente/ConsultaGeneral.html" className="text-gray-100 hover:text-gray-300">Productos</a></li>
                            <li><a href="/" className="text-gray-100 hover:text-gray-300">Nosotros</a></li>
                        </ul>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-4">
                            <a href="./Pedido/consultaPedido.html" className="text-gray-600 hover:text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-100">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                            </a>
                            <a href="./Pedido/carritoCompras.html" className="text-gray-600 hover:text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-100">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </a>
                            <div className="relative">
                                <button
                                    id="dropdown-button"
                                    className="flex items-center space-x-2 py-1 text-gray-600 hover:bg-gray-600 rounded-md focus:outline-none"
                                    onClick={() => navigate('/user/customer/welcome')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-100">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M3 12h18M3 19h18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="container mx-auto p-4">
                <main className="bg-white p-8 rounded shadow-md max-w-md mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Mis Datos</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={userData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2">Correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={userData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-2">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={userData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Guardar cambios</button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default UserProfile;
