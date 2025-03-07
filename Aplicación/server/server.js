const express = require('express');
const path = require('path'); 
const bodyParser = require('body-parser');
const db = require('./db'); 
const cors = require('cors');


const corsOption= {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true
}

const app = express();
app.use(cors(corsOption));
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));


app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// Ruta para manejar el login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consulta para verificar el usuario y la contraseña
    const query = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }

        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        return res.status(200).json({ message: 'Login exitoso' });
    });
});
app.get('/clientes', (req, res) => {
    const query = 'SELECT c.nombre, c.apellido, c.dni, c.mail, c.direccion, c.telefono, c.estado, c.id_cliente, c.barrio_id, b.nombre AS barrio FROM cliente c JOIN barrios b ON c.barrio_id = b.id;'; 
  
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        } else {
            res.json(results);
        }
    });
});

app.post('/clientes', (req, res) => {
    const nuevoCliente = req.body;
    const query = 'INSERT INTO cliente (nombre, apellido, telefono, dni, direccion, mail, barrio_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
    db.query(query, [nuevoCliente.nombre, nuevoCliente.apellido, nuevoCliente.telefono, nuevoCliente.dni, nuevoCliente.direccion, nuevoCliente.mail,nuevoCliente.barrio], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        } else {
            res.status(201).json({ message: 'Cliente creado correctamente' });
        }
    })
})
app.get('/clientes/detalle/:id', (req, res) => {
    const clienteId = req.params.id;
    const query = `
        SELECT 
            c.id_cliente, 
            c.nombre, 
            c.apellido, 
            c.direccion, 
            c.telefono, 
            c.dni, 
            c.mail, 
            c.barrio_id, 
            b.nombre AS barrio
        FROM cliente c
        LEFT JOIN barrios b ON c.barrio_id = b.id 
        WHERE c.id_cliente = ?
    `;

    db.query(query, [clienteId], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json(results[0]); // Retorna los datos completos del cliente
    });
});

app.get('/clientes/:id', (req, res) => {
    const clienteId = req.params.id;
    const query = 'SELECT c.id_cliente, c.nombre, c.barrio_id, b.nombre AS barrio FROM cliente c LEFT JOIN barrios b ON c.barrio_id = b.id WHERE c.id_cliente = ?'
    ;

    db.query(query, [clienteId], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json(results[0]);
    });
});
app.put('/clientes/:id', (req, res) => {
    const clienteId = req.params.id;
    const datosActualizados = req.body;
    const mail = datosActualizados.mail ? datosActualizados.mail : null
    const query = 'UPDATE cliente SET nombre = ?, apellido = ?, telefono = ?, dni = ?, direccion = ?, mail = ?, barrio_id = ? WHERE id_cliente = ?';

    db.query(query, [datosActualizados.nombre, datosActualizados.apellido, datosActualizados.telefono, datosActualizados.dni, datosActualizados.direccion, mail, datosActualizados.barrio, clienteId], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente actualizado correctamente' });
    });
});
app.put('/clientes/:id/estado', (req, res) => {
    const clienteId = req.params.id;
    const { estado } = req.body;

    // Asegúrate de que el estado sea un número (0 o 1)
    if (estado !== 0 && estado !== 1) {
        return res.status(400).json({ message: 'El estado debe ser 0 (inactivo) o 1 (activo).' });
    }

    const query = 'UPDATE cliente SET estado = ? WHERE id_cliente = ?';

    db.query(query, [estado, clienteId], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Estado del cliente actualizado correctamente' });
    });
});
// Endpoint para obtener clientes por estado
app.get('/clientes/estado/:estado', (req, res) => {
    const estado = parseInt(req.params.estado);

    // Validar que el estado sea 0 o 1
    if (estado !== 0 && estado !== 1) {
        return res.status(400).json({ message: 'El estado debe ser 0 (inactivo) o 1 (activo).' });
    }

    const query = `
    SELECT c.nombre, c.apellido, c.dni, c.mail, c.direccion, c.telefono, c.estado, 
           b.nombre AS barrio, c.id_cliente
    FROM cliente c
    JOIN barrios b ON c.barrio_id = b.id
    WHERE c.estado = ?;
`;
    db.query(query, [estado], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }

        res.json(results);
    });
});
app.get('/barrios', (req, res) => {
    const query = `
        SELECT b.id, b.nombre AS barrio, COUNT(c.id_cliente) AS cantidadClientes
        FROM barrios b
        LEFT JOIN cliente c ON b.id = c.barrio_id
        GROUP BY b.id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los barrios' });
        }
        res.json(results);
    });
});

app.get('/clientes/idBarrio/:barrioId', (req, res) => {
    const { barrioId } = req.params;
    const query = `
        SELECT c.id_cliente, c.nombre, c.apellido, c.direccion, c.telefono, b.nombre AS barrio
        FROM cliente c
        JOIN barrios b ON c.barrio_id = b.id
        WHERE c.barrio_id = ?;
    `;
    db.query(query, [barrioId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los clientes del barrio' });
        }
        res.json(results);
    });
});


app.post('/barrios', (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre del barrio es obligatorio' });
    }

    const query = `INSERT INTO barrios (nombre) VALUES (?)`;
    db.query(query, [nombre], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al agregar el barrio' });
        }
        res.status(201).json({ message: 'Barrio agregado con éxito', barrioId: results.insertId });
    });
});




//?                                 SECCION PRODUCTOS
app.get('/productos/:id', (req, res) => {
    const productoId = req.params.id;
    const query = 'SELECT * FROM producto WHERE id_producto = ?';

    db.query(query, [productoId], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(results[0]); // Devuelve el primer resultado
    });
});

app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    const sql = 'INSERT INTO producto (nombre, descripcion, precio) VALUES (?, ?, ?)';
    db.query(sql, [nombre, descripcion, precio], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Producto agregado', id: result.insertId });
    });
});

// ruta para todos los productos 
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM producto';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// ruta para actualizar un producto
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre,descripcion, precio } = req.body;
    const sql = 'UPDATE producto SET nombre = ?, descripcion = ? , precio = ? WHERE id_producto = ?';
    db.query(sql, [nombre, descripcion, precio, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Producto actualizado' });
    });
});

// eliminar un producto
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM producto WHERE id_producto = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Producto eliminado' });
    });
});
// Ruta para actualizar solo el estado de un producto
app.patch('/productos/:id/estado', (req, res) => {
    const productoId = req.params.id;
    const { estado } = req.body; 

    if (estado !== 0 && estado !== 1) {
        return res.status(400).json({ message: 'El estado debe ser 0 (inactivo) o 1 (activo).' });
    }

    const query = 'UPDATE producto SET estado = ? WHERE id_producto = ?';

    db.query(query, [estado, productoId], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: 'Estado del producto actualizado correctamente' });
    });
});
//?                             PEDIDOS
// Ruta para obtener todos los pedidos
//?                                 SECCIÓN PEDIDOS

// Obtener todos los pedidos
app.get('/pedidos', (req, res) => {
    const query = 'SELECT * FROM pedido';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }
        res.json(results);
    });
});
app.get('/pedidostodos', (req, res) => {
    const query = 'SELECT * FROM pedido ';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }
        res.json(results);
    });
});

// Obtener un pedido específico por ID
app.get('/pedidos/:id', (req, res) => {
    const pedidoId = req.params.id;
    const query = 'SELECT * FROM pedido WHERE id_pedido = ?';

    db.query(query, [pedidoId], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json(results[0]);
    });
});

// Crear un nuevo pedido
app.post('/pedidos', (req, res) => {
    const { id_cliente, direccionEntrega, productosAEntregar, fechaEntrega, total,barrio } = req.body;
    const query = 'INSERT INTO pedido (id_cliente, direccionEntrega, productosAEntregar, fechaEntrega, Total, barrio) VALUES (?, ?, ?, ? , ?, ?)';

    db.query(query, [id_cliente, direccionEntrega, productosAEntregar, fechaEntrega, total,barrio], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }
        res.status(201).json({ message: 'Pedido creado correctamente', id_pedido: results.insertId });
    });
});

// Actualizar un pedido existente
// app.put('/pedidos/:id', (req, res) => {
//     const pedidoId = req.params.id;
//     const { id_cliente, direccionEntrega, productosAEntregar, fechaEntrega, total } = req.body;
//     const query = 'UPDATE pedido SET id_cliente = ?, direccionEntrega = ?, productosAEntregar = ?, fechaEntrega = ? , total = ?, barrio=? WHERE id_pedido = ?';

//     db.query(query, [id_cliente, direccionEntrega, productosAEntregar, fechaEntrega,total, pedidoId], (error, results) => {
//         if (error) {
//             console.error('Error en la base de datos:', error);
//             return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
//         }

//         if (results.affectedRows === 0) {
//             return res.status(404).json({ message: 'Pedido no encontrado' });
//         }

//         res.json({ message: 'Pedido actualizado correctamente' });
//     });
// });
app.put('/pedidos/:id', (req, res) => {
    const pedidoId = parseInt(req.body.id_pedido) || parseInt(req.params.id);
    const { id_cliente, direccionEntrega, productosAEntregar, fechaEntrega, total, barrio } = req.body;

    console.log('Datos recibidos:', req.body);

    if (!id_cliente || !direccionEntrega || !productosAEntregar || !fechaEntrega || isNaN(total) || !barrio) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios y deben ser válidos.' });
    }

    const query = `
        UPDATE pedido 
        SET id_cliente = ?, direccionEntrega = ?, productosAEntregar = ?, fechaEntrega = ?, total = ?, barrio = ?
        WHERE id_pedido = ?
    `;

    db.query(query, [id_cliente, direccionEntrega, productosAEntregar, fechaEntrega, total, barrio, pedidoId], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json({ message: 'Pedido actualizado correctamente' });
    });
});



// Ruta para obtener todos los pedidos con el nombre del cliente
app.get('/pedidosnombre', (req, res) => {
    const sql = `
        SELECT 
            p.id_pedido, 
            c.nombre AS nombre_cliente, 
            p.direccionEntrega, 
            p.productosAEntregar, 
            p.fechaEntrega,
            p.Total,
            p.barrio,
            p.estado
        FROM 
            pedido p 
        JOIN 
            CLIENTE c ON p.id_cliente = c.id_cliente
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


// Eliminar un pedido
app.delete('/pedidos/:id', (req, res) => {
    const pedidoId = req.params.id;
    const query = 'DELETE FROM pedido WHERE id_pedido = ?';

    db.query(query, [pedidoId], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error);
            return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json({ message: 'Pedido eliminado correctamente' });
    });
});
// Endpoint para actualizar el estado del pedido
app.put('/pedidos/actualizarEstado/:id', (req, res) => {
    const idPedido = req.params.id;
    const nuevoEstado = req.body.estado;

    if (typeof nuevoEstado !== 'number') {
        return res.status(400).json({ error: 'El estado debe ser un número (0 o 1)' });
    }

    const query = 'UPDATE pedido SET estado = ? WHERE id_pedido = ?';
    db.query(query, [nuevoEstado, idPedido], (err, results) => {
        if (err) {
            console.error('Error al actualizar el estado del pedido:', err);
            return res.status(500).json({ error: 'Error al actualizar el pedido' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.status(200).json({ message: 'Estado del pedido actualizado correctamente' });
    });
});

    // Endpoint para obtener pedidos por estado
app.get('/pedidoPorEstado', (req, res) => {
    const estado = req.query.estado; // Leer el parámetro 'estado' de la query string

    // Validar que el estado sea válido (0 para entregados, 1 para sin entregar)
    if (estado !== '0' && estado !== '1') {
        return res.status(400).json({ error: 'El parámetro estado debe ser "0" (entregados) o "1" (sin entregar)' });
    }

    const query = `
        SELECT 
            p.id_pedido, 
            c.nombre AS nombre_cliente, 
            p.direccionEntrega, 
            p.productosAEntregar, 
            p.fechaEntrega,
            p.Total,
            p.barrio,
            p.estado
        FROM 
            pedido p
        JOIN 
            cliente c ON p.id_cliente = c.id_cliente
        WHERE 
            p.estado = ?
    `;

    db.query(query, [Number(estado)], (err, results) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({ error: 'Error en la base de datos', detalle: err.message });
        }
        res.json(results);
    });
});


    // Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


