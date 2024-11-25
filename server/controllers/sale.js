const db = require("../config/conexion");

const createVenta = (req, res) => {
    console.log("Datos recibidos en el servidor:", req.body);
  
    const { usuario_id, productos, descuento, metodo_pago, total } = req.body;
  
    // Verificación explícita de cada campo
    if (!usuario_id) {
      console.log("Falta 'usuario_id'");
    }
    if (!productos || productos.length === 0) {
      console.log("Faltan 'productos'");
    }
    if (!metodo_pago) {
      console.log("Falta 'metodo_pago'");
    }
  
    if (!usuario_id || !productos || productos.length === 0 || !metodo_pago) {
      return res.status(400).json({ message: 'Faltan datos necesarios para la venta.' });
    }
  
    // Si llega a este punto, significa que los datos son válidos
    console.log("Los datos son correctos, procesando la venta...");
  
    const subtotal = productos.reduce((acc, producto) => acc + producto.subtotal, 0);
    const iva = subtotal * 0.19; // IVA del 19%
    const totalVenta = subtotal + iva - (descuento || 0);
  
    // Usamos el pool para insertar la venta en la tabla 'ventas'
    db.query(
      `INSERT INTO ventas (fecha_hora, descuento, subtotal, iva, total, metodo_pago, usuario_id) 
       VALUES (CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?)`,
      [descuento || 0, subtotal, iva, totalVenta, metodo_pago, usuario_id],
      (err, ventaResult) => {
        if (err) {
          console.error("Error al registrar la venta:", err);
          return res.status(500).json({ message: 'Error al registrar la venta.' });
        }
  
        const venta_id = ventaResult.insertId;
        console.log("Venta registrada con ID:", venta_id);
  
        // Insertar los detalles de la venta (por cada producto)
        const detallesPromises = productos.map((producto) => {
          const { id: producto_id, cantidad, precio, subtotal } = producto;
          return new Promise((resolve, reject) => {
            db.query(
              `INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
               VALUES (?, ?, ?, ?, ?)`,
              [venta_id, producto_id, cantidad, precio, subtotal],
              (err) => {
                if (err) {
                  reject(`Error al insertar el producto ID ${producto_id}: ${err}`);
                } else {
                  console.log(`Producto ID: ${producto_id} insertado en detalle_venta`);
                  resolve();
                }
              }
            );
          });
        });
  
        // Esperar a que todos los productos se registren
        Promise.all(detallesPromises)
          .then(() => {
            console.log("Venta registrada con éxito.");
  
            // Descontar los productos vendidos del inventario
            const updatePromises = productos.map((producto) => {
              const { id: producto_id, cantidad } = producto;
              return new Promise((resolve, reject) => {
                db.query(
                  `UPDATE productos 
                   SET cantidad = cantidad - ? 
                   WHERE id = ?`,
                  [cantidad, producto_id],
                  (err, result) => {
                    if (err) {
                      reject(`Error al actualizar la cantidad del producto ID ${producto_id}: ${err}`);
                    } else {
                      console.log(`Producto ID: ${producto_id} actualizado en el inventario`);
                      resolve();
                    }
                  }
                );
              });
            });
  
            // Esperar a que se actualicen las cantidades de todos los productos
            Promise.all(updatePromises)
              .then(() => {
                res.status(201).json({
                  message: 'Venta registrada con éxito y cantidades de productos actualizadas.',
                  venta_id,
                  total: totalVenta,
                });
              })
              .catch((error) => {
                console.error(error);
                res.status(500).json({ message: 'Error al actualizar las cantidades de los productos.' });
              });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Error al registrar los productos de la venta.' });
          });
      }
    );
  };
  
const sales = (req, res) => {
    db.query(`
      SELECT
        v.id AS venta_id,
        v.descuento,
        v.subtotal AS venta_subtotal,
        v.iva,
        v.total AS venta_total,
        v.metodo_pago,
        v.fecha_hora,
        p.id AS producto_id,
        p.nombre AS producto_nombre,
        p.precio AS precio_unitario,
        dv.cantidad,
        dv.subtotal AS detalle_subtotal
      FROM
        ventas v
      JOIN detalle_venta dv ON v.id = dv.venta_id
      JOIN productos p ON dv.producto_id = p.id;
    `, (err, rows) => {
      if (err) {
        console.error('Error al consultar ventas:', err);
        return res.status(500).json({ message: 'Error al obtener las ventas.' });
      }
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron ventas.' });
      }
  
      // Agrupar los productos por venta
      const ventas = rows.reduce((acc, row) => {
        const { venta_id, descuento, venta_subtotal, iva, venta_total, metodo_pago, fecha_hora, producto_id, producto_nombre, precio_unitario, cantidad, detalle_subtotal } = row;
  
        // Si la venta no existe en el acumulador, la creamos
        if (!acc[venta_id]) {
          acc[venta_id] = {
            id: venta_id,
            descuento,
            subtotal: venta_subtotal,
            iva,
            total: venta_total,
            metodo_pago,
            fecha_hora,
            productos: []
          };
        }
  
        // Añadimos el producto a la venta
        acc[venta_id].productos.push({
          id: producto_id,
          nombre: producto_nombre,
          precio_unitario,
          cantidad,
          subtotal: detalle_subtotal
        });
  
        return acc;
      }, {});
  
      // Convertimos el objeto a un array para enviar la respuesta
      const ventasArray = Object.values(ventas);
  
      res.status(200).json(ventasArray); // Devolvemos las ventas con sus productos
    });
  };
  

module.exports = {
  createVenta,
  sales
};
