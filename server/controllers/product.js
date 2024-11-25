const db = require('../config/conexion');

//Creación de productos
const createProduct = (req, res) => {
    const { nombre, cantidad, precio, descripcion, imagen, categoria_id } = req.body;
    const estado = req.body.estado || "Activo";  

    db.query('INSERT INTO productos (nombre, cantidad, precio, descripcion, imagen, categoria_id, estado) VALUES(?,?,?,?,?,?,?)',
    [nombre, cantidad, precio, descripcion, imagen, categoria_id, estado],
    (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al registrar el producto.");
        } else {
            console.log(result);
            res.send("Producto registrado con éxito!");
        }
    });
};


//Consulta especifica de productos
const specificProduct = (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener el producto");
        }
        if (result.length === 0) {
            return res.status(404).send("Producto no encontrado");
        }
        res.send(result[0]);
    });
}

//Consulta de productos en estado activo
const products = (req,res)=>{

    db.query('SELECT * FROM productos where estado="activo"',
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
            
            res.send(result);
        }
    }
    );
}

//Consulta de productos en estado inactivo
const productsInactive = (req, res) => {
    db.query('SELECT * FROM productos WHERE estado="inactivo"', (err, result) => {
        if (err) {
            console.log("Error al consultar productos inactivos:", err);
            return res.status(500).send("Error al obtener los productos inactivos");
        } else {
            console.log("Productos inactivos encontrados:", result);  // Verificar si se están devolviendo resultados
            if (result.length === 0) {
                console.log("No hay productos inactivos en la base de datos.");
            }
            res.send(result);  // Responde con los productos inactivos
        }
    });
}


//Activar un producto
const activateProduct = (req, res) => {
    const id = req.params.id;
    const { description, userId } = req.body;
  
    console.log("Activando producto con ID:", id);
    console.log("Descripción de la activación:", description);
    console.log("ID de usuario recibido:", userId);
  
    if (!userId) {
      return res.status(400).send("Falta el ID del usuario.");
    }
  
    db.query('UPDATE productos SET estado="activo" WHERE id=?', [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error al actualizar el producto");
      }
  
      if (result.affectedRows > 0) {
        const insertHistoryQuery = 'INSERT INTO historial_activaciones (producto_id, descripcion, usuario_id) VALUES (?, ?, ?)';
        db.query(insertHistoryQuery, [id, description, userId], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error al guardar el historial de activación.");
          }
          console.log("Historial de activación guardado con éxito");
          res.status(200).send("Producto activado y historial guardado con éxito.");
        });
      } else {
        res.status(404).send("Producto no encontrado");
      }
    });
  };


//Historico agregación y desagregación
const updateProductQuantity = (req, res) => {
  const id = req.params.id;
  const { 
    addQuantity, 
    removeQuantity, 
    userId, 
    removalReason,
    addReason 
  } = req.body;

  // Primero obtener la cantidad actual
  db.query('SELECT cantidad FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error al obtener el producto");
    }

    if (result.length === 0) {
      return res.status(404).send("Producto no encontrado");
    }

    const currentQuantity = result[0].cantidad;
    const newQuantity = currentQuantity + (Number(addQuantity) || 0) - (Number(removeQuantity) || 0);

    // Actualizar la cantidad del producto
    db.query(
      'UPDATE productos SET cantidad = ? WHERE id = ?',
      [newQuantity, id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error al actualizar la cantidad");
        }

        // Registrar en el historial si hay agregación
        if (Number(addQuantity) > 0) {
          const addHistoryQuery = 'INSERT INTO historial_movimientos (producto_id, tipo_movimiento, cantidad, descripcion, usuario_id) VALUES (?, ?, ?, ?, ?)';
          db.query(addHistoryQuery, [id, 'agregacion', addQuantity, addReason, userId], (err) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Error al guardar el historial de agregación");
            }
          });
        }

        // Registrar en el historial si hay desagregación
        if (Number(removeQuantity) > 0) {
          const removeHistoryQuery = 'INSERT INTO historial_movimientos (producto_id, tipo_movimiento, cantidad, descripcion, usuario_id) VALUES (?, ?, ?, ?, ?)';
          db.query(removeHistoryQuery, [id, 'desagregacion', removeQuantity, removalReason, userId], (err) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Error al guardar el historial de desagregación");
            }
          });
        }

        res.status(200).send("Cantidad actualizada y historial guardado con éxito");
      }
    );
  });
};


// Creación de categoria
const createCategory = (req,res)=>{
  const {nombre} = req.body;

  db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error al registrar la categoría.");
    } else {
      console.log(result);
      return res.status(200).send("Categoría registrada con éxito!");
    }
  });
};

// Obtener todas las categorías
const getCategories = (req, res) => {
  console.log('Obteniendo categorías');
  db.query('SELECT * FROM categorias', (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error al obtener las categorías.");
    }
    console.log("Categorías obtenidas:", result);
    res.status(200).send(result);
  });
};


// Actualizar categoría
const updateCategory = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  db.query(
    'UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error al actualizar la categoría.",
          error: err.message
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Categoría no encontrada."
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Categoría actualizada con éxito!"
      });
    }
  );
};


// Eliminar categoría
const deleteCategory = (req, res) => {
  const { id } = req.params;

  // Primero verificar si la categoría está en uso
  db.query(
    'SELECT COUNT(*) as count FROM productos WHERE categoria_id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error al verificar el uso de la categoría.",
          error: err.message
        });
      }

      if (result[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: "No se puede eliminar la categoría porque está siendo utilizada por productos."
        });
      }

      // Si no está en uso, proceder con la eliminación
      db.query(
        'DELETE FROM categorias WHERE id = ?',
        [id],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: false,
              message: "Error al eliminar la categoría.",
              error: err.message
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "Categoría no encontrada."
            });
          }

          res.status(200).json({
            success: true,
            message: "Categoría eliminada con éxito!"
          });
        }
      );
    }
  );
};

//Actualización de un producto
const updateProduct = (req,res)=>{
    const id = req.body.id;
    const nombre = req.body.nombre;
    const cantidad = req.body.cantidad;
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;
    const imagen = req.body.imagen;
    const categoria_id = req.body.categoria_id;

    db.query('UPDATE productos SET nombre=?,cantidad=?,precio=?,descripcion=?,imagen=?,categoria_id=? WHERE id=?',[nombre,cantidad,precio,descripcion,imagen,categoria_id,id],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send("Producto actualizado con exito!!")
        }
    }
    );
}


//Inactivación de un producto
const inactivateProduct = (req, res) => {
    const id = req.params.id;
    const { userId, description } = req.body;
  
    console.log("Datos recibidos en el backend:", { userId, description });

    console.log("Inactivando producto con ID:", id);
    console.log("Descripción de la inactivación:", description);
    console.log("ID de usuario recibido:", userId);
  
    if (!userId) {
      return res.status(400).send("Falta el ID del usuario.");
    }
  
    db.query('UPDATE productos SET estado="Inactivo" WHERE id=?', [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error al actualizar el producto");
      }
  
      if (result.affectedRows > 0) {
        const insertHistoryQuery = 'INSERT INTO historial_inactivaciones (producto_id, descripcion, usuario_id) VALUES (?, ?, ?)';
        db.query(insertHistoryQuery, [id, description, userId], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error al guardar el historial de inactivación.");
          }
          console.log("Historial de inactivación guardado con éxito");
          res.status(200).send("Producto inactivado y historial guardado con éxito.");
        });
      } else {
        res.status(404).send("Producto no encontrado");
      }
    });
  };


module.exports = {
    createProduct,
    specificProduct,
    products,
    updateProduct,
    inactivateProduct,
    productsInactive,
    activateProduct,
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    updateProductQuantity
}