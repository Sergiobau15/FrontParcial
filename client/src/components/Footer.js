import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {

    return (

        <footer className="bg-gray-800 text-white p-6 mt-auto">
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full sm:w-1/3 mb-6 sm:mb-0">
                        <h3 className="text-lg font-bold mb-2">Solo eléctricos</h3>
                        <p>Su tienda de confianza para productos de ferretería y eléctricos.</p>
                    </div>
                    <div className="w-full sm:w-1/3 mb-6 sm:mb-0">
                        <h3 className="text-lg font-bold mb-2">Enlaces rápidos</h3>
                        <ul>
                            <li>
                                <Link to="/" className="hover:text-gray-300">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/Nosotros" className="hover:text-gray-300">
                                    Nosotros
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="w-full sm:w-1/3">
                        <h3 className="text-lg font-bold mb-2">Contacto</h3>
                        <p>Email: info@soloelectricos.com</p>
                        <p>Teléfono: +57 3143656024</p>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <p>&copy; 2024 Solo eléctricos. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;