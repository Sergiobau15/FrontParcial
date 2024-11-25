const db = require("../config/conexion");

// Función para registrar un pedido y sus productos de manera unificada
// const createOrder = (req, res) => {
//   const { nombre, numero, direccion, metodo, productos } = req.body; // productos es un array de productos
  
//   console.log("Datos del pedido:", req.body); // Verifica que los datos estén llegando correctamente

//   // Validamos que todos los campos necesarios estén presentes
//   if (!nombre || !numero || !direccion || !metodo || !productos || productos.length === 0) {
//     console.error("Faltan datos en el pedido");
//     return res.status(400).send("Faltan datos en el pedido.");
//   }

//   // Iniciar una transacción para asegurar que todo se registre correctamente
//   db.beginTransaction((err) => {
//     if (err) {
//       console.error("Error al iniciar transacción:", err);
//       return res.status(500).send("Error al iniciar transacción.");
//     }

//     // Registrar el pedido
//     db.query(
//       'INSERT INTO pedido (nombre, numero, direccion, metodo) VALUES (?, ?, ?, ?)',
//       [nombre, numero, direccion, metodo],
//       (err, results) => {
//         if (err) {
//           console.error("Error al registrar el pedido:", err);
//           return db.rollback(() => {
//             res.status(500).send("Error al registrar el pedido");
//           });
//         }

//         const pedidoId = results.insertId; // ID del pedido recién creado
//         console.log("Pedido creado con ID:", pedidoId); // Verifica que el pedido se haya creado correctamente

//         // Preparar los valores para insertar los productos del pedido
//         const values = productos.map(producto => [
//           pedidoId,
//           producto.producto_id,
//           producto.cantidad,
//           producto.precio_unitario,
//           producto.cantidad * producto.precio_unitario // Calcular el precio total por producto
//         ]);

//         // Insertar los productos del pedido
//         const sql = 'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, precio_total) VALUES ?';

//         db.query(sql, [values], (err, results) => {
//           if (err) {
//             console.error("Error al insertar productos del pedido:", err);
//             return db.rollback(() => {
//               res.status(500).send("Error al registrar los productos del pedido.");
//             });
//           }
          
//           console.log("Productos del pedido insertados");

//           // Actualizar las cantidades de los productos
//           productos.forEach(producto => {
//             const sqlUpdate = 'UPDATE productos SET cantidad = cantidad - ? WHERE id = ?';
//             db.query(sqlUpdate, [producto.cantidad, producto.producto_id], (err, results) => {
//               if (err) {
//                 console.error("Error al actualizar la cantidad del producto:", err);
//                 return db.rollback(() => {
//                   res.status(500).send("Error al actualizar las cantidades de los productos.");
//                 });
//               }

//               console.log(`Producto ${producto.producto_id} actualizado con éxito`);
//             });
//           });

//           // Confirmar la transacción si todo ha ido bien
//           db.commit((err) => {
//             if (err) {
//               console.error("Error al confirmar la transacción:", err);
//               return db.rollback(() => {
//                 res.status(500).send("Error al registrar el pedido y sus productos.");
//               });
//             }

//             console.log("Transacción confirmada");
//             res.status(201).send("Pedido y productos registrados con éxito.");
//           });
//         });
//       }
//     );
//   });
// };

const createOrder = (req, res) => {
  const { nombre, numero, direccion, metodo, productos } = req.body;
  
  console.log("Datos del pedido:", req.body);

  if (!nombre || !numero || !direccion || !metodo || !productos || productos.length === 0) {
    console.error("Faltan datos en el pedido");
    return res.status(400).send("Faltan datos en el pedido.");
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error al iniciar transacción:", err);
      return res.status(500).send("Error al iniciar transacción.");
    }

    db.query(
      'INSERT INTO pedido (nombre, numero, direccion, metodo) VALUES (?, ?, ?, ?)',
      [nombre, numero, direccion, metodo],
      (err, results) => {
        if (err) {
          console.error("Error al registrar el pedido:", err);
          return db.rollback(() => {
            res.status(500).send("Error al registrar el pedido");
          });
        }

        const pedidoId = results.insertId;
        console.log("Pedido creado con ID:", pedidoId);

        const values = productos.map(producto => [
          pedidoId,
          producto.producto_id,
          producto.cantidad,
          producto.precio_unitario,
          producto.cantidad * producto.precio_unitario
        ]);

        const sql = 'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, precio_total) VALUES ?';

        db.query(sql, [values], (err, results) => {
          if (err) {
            console.error("Error al insertar productos del pedido:", err);
            return db.rollback(() => {
              res.status(500).send("Error al registrar los productos del pedido.");
            });
          }
          
          console.log("Productos del pedido insertados");

          productos.forEach(producto => {
            const sqlUpdate = 'UPDATE productos SET cantidad = cantidad - ? WHERE id = ?';
            db.query(sqlUpdate, [producto.cantidad, producto.producto_id], (err, results) => {
              if (err) {
                console.error("Error al actualizar la cantidad del producto:", err);
                return db.rollback(() => {
                  res.status(500).send("Error al actualizar las cantidades de los productos.");
                });
              }

              console.log(`Producto ${producto.producto_id} actualizado con éxito`);
            });
          });

          db.commit((err) => {
            if (err) {
              console.error("Error al confirmar la transacción:", err);
              return db.rollback(() => {
                res.status(500).send("Error al registrar el pedido y sus productos.");
              });
            }

            console.log("Transacción confirmada");
            res.status(201).send("Pedido y productos registrados con éxito.");
          });
        });
      }
    );
  });
};


const createOrdercar = (req, res) => {
  const { nombre, numero, direccion, metodo, fecha, estado, productos } = req.body;

  if (!nombre || !numero || !direccion || !metodo || !fecha || !productos || productos.length === 0) {
    console.error("Faltan datos en el pedido");
    return res.status(400).send("Faltan datos en el pedido.");
  }

  // Iniciar una transacción para asegurar que todo se registre correctamente
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error al iniciar transacción:", err);
      return res.status(500).send("Error al iniciar transacción.");
    }

    // Registrar el pedido
    db.query(
      'INSERT INTO pedido (nombre, numero, direccion, metodo, fecha, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, numero, direccion, metodo, fecha, estado],
      (err, results) => {
        if (err) {
          console.error("Error al registrar el pedido:", err);
          return db.rollback(() => {
            res.status(500).send("Error al registrar el pedido");
          });
        }

        const pedidoId = results.insertId; // ID del pedido recién creado
        console.log("Pedido creado con ID:", pedidoId);

        // Preparar los valores para insertar los productos del pedido
        const values = productos.map(producto => [
          pedidoId,
          producto.producto_id,
          producto.cantidad,
          producto.precio_unitario,
          producto.precio_total,
          producto.estado // Establecer el estado del detalle del pedido
        ]);

        // Insertar los productos del pedido
        const sql = 'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, precio_total, estado) VALUES ?';

        db.query(sql, [values], (err, results) => {
          if (err) {
            console.error("Error al insertar productos del pedido:", err);
            return db.rollback(() => {
              res.status(500).send("Error al registrar los productos del pedido.");
            });
          }

          console.log("Productos del pedido insertados");

          // Confirmar la transacción si todo ha ido bien
          db.commit((err) => {
            if (err) {
              console.error("Error al confirmar la transacción:", err);
              return db.rollback(() => {
                res.status(500).send("Error al registrar el pedido y sus productos.");
              });
            }

            console.log("Transacción confirmada");
            res.status(201).send("Pedido y productos registrados con éxito.");
          });
        });
      }
    );
  });
};


// Función para obtener todos los pedidos y sus productos
const orders = (req, res) => {
  const query = `
    SELECT o.id, o.Nombre, o.Numero, o.Direccion, o.Metodo, o.Fecha, 
           SUM(dp.cantidad * dp.precio_unitario) AS Total
    FROM pedido o
    JOIN detalle_pedido dp ON o.id = dp.pedido_id
    WHERE o.estado = 'activo'  -- Solo seleccionar pedidos con estado 'activo'
    GROUP BY o.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la consulta' });
    }

    // Obtener los productos de cada pedido
    const ordersWithProductsPromises = results.map((order) => {
      return new Promise((resolve, reject) => {
        db.query(
          'SELECT p.id, p.nombre, dp.cantidad, dp.precio_unitario, dp.precio_total FROM detalle_pedido dp JOIN productos p ON dp.producto_id = p.id WHERE dp.pedido_id = ?', 
          [order.id],
          (err, products) => {
            if (err) {
              return reject(err);
            }
            order.products = products; // Añadir productos al pedido
            resolve(order);
          }
        );
      });
    });

    // Esperar a que todos los pedidos y productos estén listos
    Promise.all(ordersWithProductsPromises)
      .then((ordersWithProducts) => {
        res.json(ordersWithProducts); // Enviar pedidos con productos
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error al obtener los productos');
      });
  });
};

  

// Función para obtener un pedido específico por ID
const getOrderById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM pedido WHERE id = ?', [id], (err, order) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error al obtener el pedido');
    }

    if (order.length === 0) {
      return res.status(404).send('Pedido no encontrado');
    }

    // Obtener los productos del pedido
    db.query('SELECT p.id, p.nombre, dp.cantidad, dp.precio_unitario, dp.precio_total FROM detalle_pedido dp JOIN productos p ON dp.producto_id = p.id WHERE dp.pedido_id = ?', [id], (err, products) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error al obtener los productos');
      }

      order[0].products = products; // Añadir los productos al pedido
      res.json(order[0]); // Devolver el pedido con los productos
    });
  });
};

// Función para eliminar un pedido y sus productos
const deleteOrder = (req, res) => {
  const { id } = req.params;

  // Iniciar transacción
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error al iniciar transacción:", err);
      return res.status(500).send("Error al iniciar transacción.");
    }

    // Actualizar el estado del pedido a "inactivo"
    db.query('UPDATE pedido SET estado = ? WHERE id = ?', ['inactivo', id], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error al actualizar el estado del pedido:", err);
          res.status(500).send("Error al actualizar el estado del pedido.");
        });
      }

      // Actualizar el estado de los productos del pedido a "inactivo"
      db.query('UPDATE detalle_pedido SET estado = ? WHERE pedido_id = ?', ['inactivo', id], (err, results) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error al actualizar el estado de los productos del pedido:", err);
            res.status(500).send("Error al actualizar el estado de los productos.");
          });
        }

        // Confirmar la transacción si todo está bien
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error al confirmar la transacción:", err);
              res.status(500).send("Error al confirmar la transacción.");
            });
          }
          res.status(200).send("Pedido y productos actualizados a inactivos.");
        });
      });
    });
  });
};

// Función para editar un pedido (solo los campos Nombre, Numero, Direccion, Metodo)
const editOrder = (req, res) => {
  const { id } = req.params;  // Obtener el ID de la URL
  const { Nombre, Numero, Direccion, Metodo } = req.body;

  // Validar que los campos necesarios estén presentes
  if (!Nombre || !Numero || !Direccion || !Metodo) {
    return res.status(400).json({ message: "Faltan datos para actualizar el pedido." });
  }

  // Realizar la actualización del pedido
  const query = 'UPDATE pedido SET Nombre = ?, Numero = ?, Direccion = ?, Metodo = ? WHERE id = ?';

  db.query(query, [Nombre, Numero, Direccion, Metodo, id], (err, results) => {
    if (err) {
      console.error("Error al actualizar el pedido:", err);
      return res.status(500).json({ message: "Error al actualizar el pedido." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    console.log("Pedido actualizado con éxito");
    res.status(200).json({ message: "Pedido actualizado con éxito." });
  });
};



module.exports = {
  createOrder,
  createOrdercar,
  orders,
  getOrderById,
  deleteOrder,
  editOrder
};
