const Modal = ({ isVisible, message, onClose, onConfirm, isConfirmation }) => {
  // Si el modal no es visible, no lo renderizamos
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        {/* Mostrar el mensaje dentro del modal */}
        <p className="mb-4">{message}</p>
        
        <div className="flex justify-end space-x-2">
          {isConfirmation ? (
            <>
              {/* Botón de Cancelar */}
              <button
                onClick={onClose}
                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>

              {/* Botón de Confirmar */}
              <button
                onClick={onConfirm}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              >
                Confirmar
              </button>
            </>
          ) : (
            // Solo botón de cerrar si no es confirmación
            <button
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
