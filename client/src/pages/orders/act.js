const actualizarCantidadProducto = async (productoId, nuevaCantidad) => {
    try {
      const response = await fetch(`http://localhost:3001/products/${productoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cantidad: nuevaCantidad })
      });


      if (!response.ok) {
        throw new Error('Error al actualizar la cantidad del producto');
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto:', error);
    }
  };


  export default actualizarCantidadProducto;
