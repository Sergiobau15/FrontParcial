import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Key, UserCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import CashierLayout from '../../components/CashierLayout';
import StoreKeeperLayout from '../../components/StoreKeeperLayout';
import AlertModal from './AlertModal';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [confirmPassword, setConfirmPassword] = useState(''); // Nuevo estado para confirmar contraseña
    const [errorMessages, setErrorMessages] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('usuario');
        navigate('/');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:3001/users/${id}`);
                const data = await response.json();
                setUser(data);
                setFormData(data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    const handleEditClick = () => setIsEditing(true);
    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData(user);
        setConfirmPassword('');
        setErrorMessages([]);
    };

    const handleSaveClick = async () => {
        setErrorMessages([]);
        const newErrorMessages = [];

        const phoneRegex = /^3\d{9}$/;
        if (!phoneRegex.test(formData.Telefono)) {
            newErrorMessages.push('El teléfono debe tener exactamente 10 dígitos y comenzar con 3.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.Correo)) {
            newErrorMessages.push('Por favor, introduce un correo electrónico válido.');
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(formData.Nombres) || !nameRegex.test(formData.Apellidos)) {
            newErrorMessages.push('El nombre y el apellido solo pueden contener letras y espacios.');
        }

        if (formData.Contrasena.length < 6) {
            newErrorMessages.push('La contraseña debe tener al menos 6 caracteres.');
        }

        // Validar que las contraseñas coincidan
        if (formData.Contrasena !== confirmPassword) {
            newErrorMessages.push('Las contraseñas no coinciden.');
        }

        for (const key in formData) {
            if (!formData[key]) {
                newErrorMessages.push(`El campo ${key} es obligatorio.`);
            }
        }

        if (newErrorMessages.length > 0) {
            setErrorMessages(newErrorMessages);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }
            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false);
            setAlertMessage('Los datos se han actualizado correctamente.');
            setShowAlert(true);
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const closeAlert = () => {
        setShowAlert(false);
    };

    if (!user) return <div className="text-center py-10">Cargando...</div>;

    const renderField = (icon, label, value, name) => (
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
                {icon}
                <span className="ml-2">{label}</span>
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing && name !== "Rol" && name !== "Genero" ? (
                    <input
                        type={name === "Contrasena" ? "password" : "text"}
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                ) : (
                    name === "Contrasena" ? "********" : value
                )}
            </dd>
        </div>
    );

    const renderProfileContent = () => (
        <div className="max-w-sm mx-auto bg-white shadow-xl rounded-lg overflow-hidden my-10">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-28"></div>
            <div className="relative -mt-12 flex justify-center">
                <div className="rounded-full border-4 border-white p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
            </div>
            <div className="text-center mt-2">
                <h1 className="text-xl font-bold text-gray-900">{user.Nombres} {user.Apellidos}</h1>
                <p className="text-sm text-gray-600">{user.Rol}</p>
            </div>

            <div className="px-6 py-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                    {renderField(<Mail className="h-5 w-5 text-gray-500" />, "Correo", user.Correo, "Correo")}
                    {renderField(<MapPin className="h-5 w-5 text-gray-500" />, "Dirección", user.Direccion, "Direccion")}
                    {renderField(<UserCircle className="h-5 w-5 text-gray-500" />, "Género", user.Genero, "Genero")}
                    {renderField(<Phone className="h-5 w-5 text-gray-500" />, "Teléfono", user.Telefono, "Telefono")}
                    {renderField(<Key className="h-5 w-5 text-gray-500" />, "Contraseña", user.Contrasena, "Contrasena")}
                    {isEditing && (
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <Key className="h-5 w-5 text-gray-500" />
                                <span className="ml-2">Confirmar Contraseña</span>
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </dd>
                        </div>
                    )}
                </div>
                {errorMessages.length > 0 && (
                    <div className="text-red-500">
                        {errorMessages.map((msg, index) => (
                            <p key={index}>{msg}</p>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-center pb-6">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSaveClick}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={handleCancelClick}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                        Editar Perfil
                    </button>
                )}
            </div>

            {showAlert && (
                <AlertModal message={alertMessage} onClose={closeAlert} />
            )}
        </div>
    );

    const renderLayout = () => {
        if (user.Rol === 'Administrador') {
            return (
                <AdminLayout>
                    {renderProfileContent()}
                </AdminLayout>
            );
        } else if (user.Rol === 'Almacenista') {
            return (
                <StoreKeeperLayout>
                    {renderProfileContent()}
                </StoreKeeperLayout>
            );
        } else if (user.Rol === 'Cajero') {
            return (
                <CashierLayout>
                    {renderProfileContent()}
                </CashierLayout>
            );
        } else if (user.Rol === 'Cliente') {
            return (
                <>
                    <header className="bg-gray-800 py-4 shadow-md w-full">
                        <div className="container mx-auto px-4 flex justify-between items-center">
                            <a href="/consultaProductoCliente" className="text-lg font-bold text-white">Solo Electricos</a>
                            <nav className="hidden md:flex space-x-4">
                                <ul className="flex space-x-4">
                                    <li><a href="/consultaProductoCliente" className="text-white hover:text-gray-300">Inicio</a></li>
                                    <li><a href="/pedidoCliente" className="text-white hover:text-gray-300">Mis Pedidos</a></li>
                                </ul>
                            </nav>
                            <div className="flex items-center space-x-4">
                                <a href="/Cart" className="flex items-center space-x-2 text-white hover:bg-gray-300 p-2 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.6 3h12.8l.6-3h2M3 3l3 15h12l3-15H3zm3 15a2 2 0 100 4 2 2 0 000-4zm12 0a2 2 0 100 4 2 2 0 000-4z" />
                                    </svg>
                                    <span>Carrito</span>
                                </a>
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
                    </header>
                    {renderProfileContent()}
                </>
            );
        }
        return null;
    };

    return (
        <>
            {renderLayout()}
        </>
    );
};

export default UserProfile;
