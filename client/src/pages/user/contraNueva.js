import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ContraNueva() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const hasNumber = /\d/.test(pass);
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    return {
      length: pass.length >= 8,
      number: hasNumber,
      upper: hasUpperCase,
      lower: hasLowerCase,
      special: hasSpecialChar
    };
  };

  const strength = validatePassword(password);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!Object.values(strength).every(Boolean)) {
      setError('Por favor cumple con todos los requisitos de la contraseña');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    actualizarContrasena();

  };

  const actualizarContrasena = () => {
    const user = JSON.parse(sessionStorage.getItem('usuario'));
    const id = user?.ID; // Accede al ID en el objeto (verifica si es "ID" o "id")
    console.log("ID del usuario:", id);

    axios.post("http://localhost:3002/users/password", {
      ID: id,
      Contrasena: password
    })
      .then(() => {
        switch (user.Rol) {
          case 'Administrador':
            navigate('/bienvenidaAdministrador');
            break;
          case 'Almacenista':
            navigate('/bienvenidaAlmacenista');
            break;
          case 'Cajero':
            navigate('/bienvenidaCajero');
            break;
          case 'Cliente':
            navigate('/consultaProductoCliente');
            break;
          default:
            navigate('/');
            break;
        }
      })
      .catch(error => {
        console.error("Hubo un error en la actualización de la contraseña:", error);
        setError("Hubo un error en la actualización de la contraseña.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="relative px-7 py-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6 shadow-lg">
              <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="space-y-2">
                <p className="text-slate-800 text-xl font-bold">SoloEléctricos</p>
                <p className="text-slate-600 text-sm">Tu ferretería eléctrica de confianza</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
            <svg className="mx-auto h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="mt-4 text-3xl font-extrabold text-white">
              Primer Acceso
            </h2>
            <p className="mt-2 text-blue-100">
              Configura tu nueva contraseña para comenzar
            </p>
          </div>

          <div className="px-6 py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nueva Contraseña
                </label>
                <div className="mt-1 relative group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
                    placeholder="Ingresa tu nueva contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Requisitos:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries({
                    'Mínimo 8 caracteres': strength.length,
                    'Mayúscula': strength.upper,
                    'Minúscula': strength.lower,
                    'Número': strength.number,
                    'Caracter especial': strength.special
                  }).map(([text, isValid]) => (
                    <div key={text} className={`flex items-center space-x-2 text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className={`h-4 w-4 ${isValid ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-red-800 border border-red-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl bg-green-50 p-4 text-green-800 border border-green-200">
                  ¡Contraseña actualizada exitosamente! Serás redirigido en breve...
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
              >
                <span>Actualizar Contraseña</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}