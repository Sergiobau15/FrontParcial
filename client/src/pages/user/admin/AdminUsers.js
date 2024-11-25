import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [inactiveSearchTerm, setInactiveSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchInactiveUsers();
    }, []);

    const usersPerPage = 4;

    const fetchUsers = () => {
        axios.get('http://localhost:3002/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    };

    const filteredUsers = users.filter(user => {
        const fullName = `${user.Nombres} ${user.Apellidos}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole ? user.Rol === selectedRole : true;
        return matchesSearch && matchesRole;
    });

    const filteredInactiveUsers = inactiveUsers.filter(user => {
        const fullName = `${user.Nombres} ${user.Apellidos}`.toLowerCase();
        return fullName.includes(inactiveSearchTerm.toLowerCase());
    });

    const paginatedInactiveUsers = filteredInactiveUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const fetchInactiveUsers = () => {
        axios.get('http://localhost:3002/users/idle')
            .then(response => {
                setInactiveUsers(response.data);
            })
            .catch(error => {
                console.error('Error al obtener usuarios inactivos:', error);
            });
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleReactivate = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres reactivar este usuario?')) {
            try {
                await axios.get(`http://localhost:3002/users/reactivate/${userId}`);
                console.log('Usuario reactivado:', userId);
                fetchUsers();
                fetchInactiveUsers();
            } catch (error) {
                console.error('Error al reactivar el usuario:', error);
            }
        }
    };

    const closeInactiveModal = () => {
        setIsInactiveModalOpen(false);
    };

    // Función que se ejecuta al enviar el formulario de actualización
    const handleUpdate = async (e) => {
        e.preventDefault();

        // Crear un objeto con todos los datos necesarios para actualizar el usuario
        const userData = {
            ID: selectedUser.ID,
            Nombres: selectedUser.Nombres,
            Apellidos: selectedUser.Apellidos,
            Correo: selectedUser.Correo,
            Contrasena: selectedUser.Contrasena, // Asegúrate de incluir la contraseña si es necesario
            Telefono: selectedUser.Telefono,
            Direccion: selectedUser.Direccion,
            Genero: selectedUser.Genero,
            Rol: selectedUser.Rol,
            Estado: selectedUser.Estado,
        };

        try {
            // Realizar solicitud POST para actualizar el usuario
            await axios.post(`http://localhost:3002/users/update`, userData);
            console.log('Usuario actualizado:', userData);
            closeModal();  // Cerrar modal
            fetchUsers();  // Refrescar la lista de usuarios
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    };


    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario permanentemente?')) {
            try {
                await axios.get(`http://localhost:3002/users/desactivate/${userId}`);
                console.log('Usuario marcado como inactivo:', userId);
                fetchUsers();
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
            }
        }
    };

    const handleOpenInactiveModal = () => {
        fetchInactiveUsers();
        setIsInactiveModalOpen(true);
    };

    const handleCloseInactiveModal = () => {
        setIsInactiveModalOpen(false);
    };

    return (
        <AdminLayout>
            <div className="flex flex-1">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                        <h1 className="text-2xl font-bold mb-6">Usuarios del sistema</h1>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <Link to="/registroUsuarioAdministrador" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Registrar usuario</Link>
                                <div className="flex space-x-4">
                                <button
                                    onClick={handleOpenInactiveModal}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Usuarios Inactivos
                                </button>
                                    <input
                                        type="text"
                                        placeholder="Buscar usuario"
                                        className="border rounded px-3 py-2"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <select
                                        className="border rounded px-3 py-2"
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    >
                                        <option value="">Todos los roles</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Cajero">Cajero</option>
                                        <option value="Almacenista">Almacenista</option>
                                        <option value="Cliente">Cliente</option>
                                    </select>

                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {filteredUsers.map(user => (
                                    <div key={user.ID} className="border rounded-lg p-4 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold">{user.Nombres} {user.Apellidos}</h3>
                                        <p className="text-gray-600 mb-4">{user.Rol}</p>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>

                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.ID)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>

                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            {isInactiveModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white mt-20 p-6 rounded-lg shadow-lg w-3/4 max-w-5xl">
                        <h2 className="text-xl mb-4 font-semibold text-center">Usuarios Inactivos</h2>
                        <input
                            type="text"
                            placeholder="Buscar usuario"
                            className="border rounded w-full px-3 py-2 mb-4"
                            value={inactiveSearchTerm}
                            onChange={(e) => setInactiveSearchTerm(e.target.value)}
                        />
                        
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Nombre</th>
                                    <th className="py-2 px-4 border-b">Correo</th>
                                    <th className="py-2 px-4 border-b">Rol</th>
                                    <th className="py-2 px-4 border-b">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedInactiveUsers.map(user => (
                                    <tr key={user.ID}>
                                        <td className="py-2 px-4 border-b">{user.Nombres} {user.Apellidos}</td>
                                        <td className="py-2 px-4 border-b">{user.Correo}</td>
                                        <td className="py-2 px-4 border-b">{user.Rol}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleReactivate(user.ID)}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                            >
                                                Reactivar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Paginación */}
                        <div className="flex justify-center mt-4">
                            {Array.from({ length: Math.ceil(filteredInactiveUsers.length / usersPerPage) }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={closeInactiveModal}
                                className="bg-white text-black border border-gray-300 p-2 rounded hover:bg-gray-300 text-sm"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-3xl">
                        <h2 className="text-xl mb-4 font-semibold text-center">Editar Usuario</h2>
                        <form onSubmit={(e) => handleUpdate(e)}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Nombres</label>
                                    <input
                                        type="hidden"
                                        value={selectedUser.ID}
                                    />
                                    <input
                                        type="text"
                                        value={selectedUser.Nombres}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Nombres: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Apellidos</label>
                                    <input
                                        type="text"
                                        value={selectedUser.Apellidos}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Apellidos: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Correo</label>
                                    <input
                                        type="email"
                                        value={selectedUser.Correo}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Correo: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Teléfono</label>
                                    <input
                                        type="number"
                                        value={selectedUser.Telefono}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Telefono: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Dirección</label>
                                    <input
                                        type="text"
                                        value={selectedUser.Direccion}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Direccion: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Género</label>
                                    <select
                                        value={selectedUser?.Genero || ''}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Genero: e.target.value })}
                                    >
                                        <option value="">Selecciona un género</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Rol</label>
                                    <select
                                        value={selectedUser.Rol}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Rol: e.target.value })}
                                    >
                                        <option value="Administrador">Administrador</option>
                                        <option value="Cajero">Cajero</option>
                                        <option value="Almacenista">Almacenista</option>
                                        <option value="Cliente">Cliente</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type='hidden'
                                        value={selectedUser.Estado}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Estado: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="hidden"
                                        value={selectedUser.Contrasena}
                                        className="border rounded w-full px-2 py-1"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" className="bg-white text-black border border-gray-300 p-2 rounded hover:bg-gray-300 text-sm" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 text-sm">Guardar</button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </AdminLayout>
    );
}   