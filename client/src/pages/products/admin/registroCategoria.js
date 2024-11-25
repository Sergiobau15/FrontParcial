import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import StoreKeeperLayout from '../../../components/StoreKeeperLayout';
import Axios from 'axios';

const CategoriaForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
  });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const userSession = sessionStorage.getItem('usuario');
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol);
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await Axios.get('http://localhost:3002/products/categories');
      if (response.status === 200 && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setError('Los datos recibidos no tienen el formato esperado');
      }
    } catch (error) {
      setError(`Error al cargar las categorías: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Actualizar categoría existente
        await Axios.put(`http://localhost:3002/products/updateCategory/${editingCategory.id}`, {
          nombre: formData.nombre
        });
        setMessage('Categoría actualizada con éxito.');
        setEditingCategory(null);
      } else {
        // Crear nueva categoría
        await Axios.post('http://localhost:3002/products/createCategory', {
          nombre: formData.nombre
        });
        setMessage('Categoría registrada con éxito.');
      }
      
      setFormData({ nombre: '' });
      fetchCategories();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ nombre: category.nombre });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      try {
        await Axios.delete(`http://localhost:3002/products/deleteCategory/${id}`);
        setMessage('Categoría eliminada con éxito.');
        fetchCategories();
      } catch (error) {
        setMessage(`Error al eliminar categoría, hay productos activos con esta categoría: ${error.message}`);
      }
    }
  };

  const renderCategoryContent = () => (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-grow p-2">
          <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">
              {editingCategory ? 'Actualizar Categoría' : 'Registrar Categoría'}
            </h1>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="nombre">
                    Nombre de la Categoría
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
                {message && (
                  <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                  </p>
                )}
                <div className="flex justify-end space-x-2">
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setFormData({ nombre: '' });
                      }}
                      className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    {editingCategory ? 'Actualizar' : 'Registrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Lista de Categorías</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-gray-600">ID</th>
                    <th className="px-4 py-2 text-left text-gray-600">Nombre</th>
                    <th className="px-4 py-2 text-center text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <tr key={category.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">{category.id}</td>
                        <td className="px-4 py-2">{category.nombre}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleEdit(category)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-300"
                          >
                            Actualizar
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                        {error ? 'Error al cargar las categorías' : 'No hay categorías registradas'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  const renderLayout = () => {
    if (userRole === 'Administrador') {
      return <AdminLayout>{renderCategoryContent()}</AdminLayout>;
    } else if (userRole === 'Almacenista') {
      return <StoreKeeperLayout>{renderCategoryContent()}</StoreKeeperLayout>;
    }
    return null;
  };

  return <>{renderLayout()}</>;
};

export default CategoriaForm;