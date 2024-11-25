import React from 'react'
import StoreKeeperLayout from '../../../components/StoreKeeperLayout';
import { Link } from 'react-router-dom'

const WelcomeStorekeeper = () => {
    return (
        <StoreKeeperLayout>
            <div className="flex min-h-screen">

                <div className="flex-1 flex flex-col overflow-hidden">

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-4">Gestionar productos</h3>
                                <div className="flex justify-between items-center">
                                    <i className="fas fa-tools text-6xl text-center" />
                                    <Link to="/consultaProducto" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ir</Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </StoreKeeperLayout>
    )
}

export default WelcomeStorekeeper;