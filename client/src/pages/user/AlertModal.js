import React from 'react';

const AlertModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg p-5 z-10">
                <h2 className="text-lg font-bold text-center">Éxito</h2>
                <p className="mt-2 text-center">{message}</p>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;