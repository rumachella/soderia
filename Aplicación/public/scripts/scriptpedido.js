let clientes = []; // Crear una variable global para almacenar los clientes
let totalProductos = 0; // Variable global para almacenar el total de productos

async function obtenerPedidos(orden = 'fecha') {
    try {
        const response = await fetch('http://localhost:3000/pedidosnombre'); // Asegúrate de que la URL es correcta
        if (!response.ok) {
            throw new Error('Error al obtener los pedidos');
        }
        pedidos = await response.json(); // variable global para pediods

        // Ordenar los pedidos según el criterio
        if (orden === 'fecha') {
            pedidos.sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega));
        } else if (orden === 'precio') {
            pedidos.sort((a, b) => b.Total - a.Total); 
        } else if (orden === 'cliente') {
            pedidos.sort((a, b) => a.nombre_cliente.localeCompare(b.nombre_cliente));
        }

        const tablaPedidos = document.getElementById('tablaPedidos');
        tablaPedidos.innerHTML = ''; 

        // Iterar sobre cada pedido y crear una fila en la tabla
        pedidos.forEach(pedido => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td id="FilaCliente">${pedido.nombre_cliente}</td>
                <td>${pedido.direccionEntrega}</td>
                <td>${pedido.barrio}</td>
                <td>${pedido.productosAEntregar}</td>
                <td>${pedido.Total}</td>
                <td>${new Date(pedido.fechaEntrega).toLocaleDateString("es-AR")}</td> <!-- Formatear la fecha -->
            `;
            tablaPedidos.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => obtenerPedidos());
document.getElementById("OrdenarSelect").addEventListener("change", (event) => {
    const criterio = event.target.value; // Valor seleccionado

    switch (criterio) {
        case "fecha":
            obtenerPedidos("fecha"); 
            break;
        case "precio":
            obtenerPedidos("precio");
            break;
        case "cliente":
            obtenerPedidos("cliente"); 
            break;
        default:
            console.log("Opción no válida");
    }
});


// Función para llenar la tabla de clientes
async function cargarClientes() {
    const response = await fetch('http://localhost:3000/clientes'); // Hacemos la solicitud al endpoint
    clientes = await response.json(); // Almacenar los clientes en la variable global

    const tablaClientes = document.getElementById("tablaClientes");
    tablaClientes.innerHTML = ""; // Limpiar tabla
    clientes.forEach(cliente => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.direccion}</td>
            <td><button class="btn btn-primary" onclick="seleccionarCliente(${cliente.id_cliente})">Seleccionar</button></td>
        `;
        tablaClientes.appendChild(row);
    });
}

// Función para seleccionar un cliente
function seleccionarCliente(id_cliente) {
    const cliente = clientes.find(c => c.id_cliente === id_cliente); // Buscar el cliente en el array global
    if (cliente) {
        document.getElementById("cliente").value = `${cliente.nombre} ${cliente.apellido}`;
        document.getElementById("direccion").value = cliente.direccion;
        document.getElementById("barrio").value=cliente.barrio
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("seleccionarClienteModal"));
        modal.hide();

        // Asegúrate de que el modal nuevoPedidoModal esté visible
        const nuevoPedidoModal = new bootstrap.Modal(document.getElementById("nuevoPedidoModal"));
        nuevoPedidoModal.show(); // Abre el modal de nuevo pedido si es necesario
    }
}

function limpiarModalSeleccionarCliente() {
    const tablaClientes = document.getElementById("tablaClientes");
    tablaClientes.innerHTML = ""; // Limpiar la tabla de clientes

    // Limpiar campos de entrada
    document.getElementById("cliente").value = ""; // Limpiar el campo de cliente
    document.getElementById("direccion").value = ""; // Limpiar el campo de dirección
}

// Cargar clientes al abrir el modal
document.getElementById("seleccionarClienteModal").addEventListener("show.bs.modal", () => {
    limpiarModalSeleccionarCliente(); // Limpiar antes de cargar nuevos clientes
    cargarClientes(); // Cargar los clientes
});

// Filtrado de clientes
document.getElementById("myInput").addEventListener("keyup", function() {
    const filter = this.value.toLowerCase();
    const tableBody = document.getElementById("tablaClientes");
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if (cell) {
                const textValue = cell.textContent || cell.innerText;
                if (textValue.toLowerCase().indexOf(filter) > -1) {
                    match = true; 
                    break; 
                }
            }
        }

        if (match) {
            rows[i].style.display = ""; 
        } else {
            rows[i].style.display = "none"; 
        }
    }
});

// Cargar productos
async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:3000/productos'); // Cambia la URL según tu backend
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }
        const productos = await response.json();
        const tablaProductos = document.getElementById("tablaProductos");
        tablaProductos.innerHTML = ""; // Limpiar tabla
        totalProductos = 0; // Reiniciar total al cargar nuevos productos

        // Iterar sobre cada producto y crear una fila en la tabla
        productos.forEach(producto => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td >${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td><input type="number" class="form-control" value="0" min="0" id="cantidad-${producto.id}" onchange="calcularTotal()"></td>
            `;
            tablaProductos.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

document.getElementById("seleccionarProductosModal").addEventListener("show.bs.modal", cargarProductos);

function calcularTotal() {
    totalProductos = 0; 
    const rows = document.querySelectorAll("#tablaProductos tr");

    rows.forEach(row => {
        const precioProducto = parseFloat(row.cells[1].innerText.replace('$', ''));
        const cantidadProducto = parseInt(row.querySelector('input[type="number"]').value);

        if (cantidadProducto > 0) {
            totalProductos += precioProducto * cantidadProducto;
        }
    });

    document.getElementById("totalProductos").value = totalProductos.toFixed(2);
}

// Función para guardar los productos seleccionados
function guardarProductos() {
    const productosSeleccionados = [];
    const rows = document.querySelectorAll("#tablaProductos tr");

    rows.forEach(row => {
        const nombreProducto = row.cells[0].innerText;
        const precioProducto = parseFloat(row.cells[1].innerText.replace('$', ''));
        const cantidadProducto = parseInt(row.querySelector('input[type="number"]').value);

        if (cantidadProducto > 0) {
            productosSeleccionados.push({
                nombre: nombreProducto,
                precio: precioProducto,
                cantidad: cantidadProducto
            });
        }
    });

    // llenar el textarea con los prod seleccionados
    const textarea = document.getElementById("productosSeleccionados");
    textarea.value = productosSeleccionados.map(p => ` ${p.nombre} - Cantidad: ${p.cantidad} |`).join('\n');

    // Cerrar el modal de seleccionar productos
    const modalSeleccionarProductos = bootstrap.Modal.getInstance(document.getElementById("seleccionarProductosModal"));
    const nuevoPedidoModal= new bootstrap.Modal(document.getElementById("nuevoPedidoModal"));
    if (modalSeleccionarProductos) {
        modalSeleccionarProductos.hide(); 
        nuevoPedidoModal.show();
    }
}

//?                           recolecta datos del modal y hace un POST

async function agregarNuevoPedido() {
    // console.log('Función agregarNuevoPedido llamada');
    const modal = document.getElementById('nuevoPedidoModal');
    const nombreCliente = document.getElementById('cliente').value;
    const direccion = document.getElementById('direccion').value;
    const productosSeleccionados = document.getElementById('productosSeleccionados').value;
    const totalProductos = document.getElementById('totalProductos').value;
    const fechaEntrega = document.getElementById('fecha').value;
    const barrio = document.getElementById('barrio').value;

    const idCliente = await obtenerIdClientePorNombre(nombreCliente);
    console.log('Total de productos:', totalProductos, '| Tipo:', typeof totalProductos);
    const totalDecimal = parseFloat(totalProductos);
    console.log('Total de productos:', totalDecimal, '| Tipo:', typeof totalDecimal);

    if (idCliente) {
        const nuevoPedido = {
            id_cliente: idCliente,
            direccionEntrega: direccion,
            productosAEntregar: productosSeleccionados,
            fechaEntrega: fechaEntrega,
            total: totalDecimal,
            barrio:barrio
        };
        const confirmacion = confirm('¿Está seguro de que desea agregar este pedido?');
        if (confirmacion) {
            try {
            const response = await fetch('http://localhost:3000/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoPedido),
            });
            
            if (!response.ok) {
                throw new Error('Error al agregar el pedido');
            }

            const resultado = await response.json();
            console.log('Pedido agregado con éxito:', resultado);
            obtenerPedidos();
            limpiarCampos();
            alert('✅Pedido agregado con éxito');

            } catch (error) {
            console.error('Error al agregar el pedido:', error);
            }
    } else {
        console.error('No se pudo obtener el ID del cliente. No se puede agregar el pedido.');
    }
}}

function limpiarCampos() {
    document.getElementById('cliente').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('productosSeleccionados').value = '';
    document.getElementById('totalProductos').value = '0.00';
    document.getElementById('fecha').value = '';
}


// Solo una vez
document.getElementById('formNuevoPedido').addEventListener('submit', async function (event) {
    event.preventDefault(); 
    await agregarNuevoPedido();
});



async function obtenerIdClientePorNombre(nombreCliente) {
    try {
        const response = await fetch('http://localhost:3000/clientes');
        
        if (!response.ok) {
            throw new Error('Error al obtener los clientes');
        }

        const clientes = await response.json();

        
        const [nombre, apellido] = nombreCliente.split(' ').map(part => part.trim().toLowerCase());
        
        const clienteEncontrado = clientes.find(cliente => 
            cliente.nombre.toLowerCase() === nombre && cliente.apellido.toLowerCase() === apellido
        );

        if (clienteEncontrado) {
            return clienteEncontrado.id_cliente; 
        } else {
            console.error('Cliente no encontrado');
            return null; 
        }
    } catch (error) {
        console.error('Error:', error);
        return null; 
    }
}
document.getElementById("filtroClientes").addEventListener("keyup", function() { 
    const filter = this.value.toLowerCase();
    const tableBody = document.getElementById("tablaPedidos");
    const rows = tableBody.querySelectorAll("tr"); // Selecciona todas las filas
  
    // Iterar sobre cada fila
    rows.forEach(row => {
        const cell = row.querySelector("td#FilaCliente"); // Selecciona solo la celda <td> con id "FilaCliente"
        
        // Comprobar si existe la celda antes de acceder a su contenido
        if (cell) {
            const textValue = cell.textContent || cell.innerText;
            
            // Mostrar u ocultar la fila según si coincide con el filtro
            if (textValue.toLowerCase().includes(filter)) {
                row.style.display = ""; 
            } else {
                row.style.display = "none"; 
            }
        }
    });
});

let pedidos = []; // Variable global para almacenar los pedidos


async function obtenerPedidos(orden = 'fecha') {
    try {
        const response = await fetch('http://localhost:3000/pedidosnombre'); // Asegúrate de que la URL es correcta
        if (!response.ok) {
            throw new Error('Error al obtener los pedidos');
        }
        pedidos = await response.json(); // variable global para pedidos

        // Obtener las fechas desde y hasta
        const fechaDesde = document.getElementById('fechaDesde').value;
        const fechaHasta = document.getElementById('fechaHasta').value;

        // Filtrar los pedidos por fecha
        if (fechaDesde || fechaHasta) {
            pedidos = pedidos.filter(pedido => {
                const fechaEntrega = new Date(pedido.fechaEntrega);
                const fechaDesdeDate = fechaDesde ? new Date(fechaDesde) : null;
                const fechaHastaDate = fechaHasta ? new Date(fechaHasta) : null;

                // Verificar si el pedido está dentro del rango de fechas
                if (fechaDesdeDate && fechaEntrega < fechaDesdeDate) return false; // Si la fecha de entrega es menor que la fecha desde
                if (fechaHastaDate && fechaEntrega > fechaHastaDate) return false; // Si la fecha de entrega es mayor que la fecha hasta

                return true;
            });
        }

        // Ordenar los pedidos según el criterio
        if (orden === 'fecha') {
            pedidos.sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega));
        } else if (orden === 'precio') {
            pedidos.sort((a, b) => b.Total - a.Total); 
        } else if (orden === 'cliente') {
            pedidos.sort((a, b) => a.nombre_cliente.localeCompare(b.nombre_cliente));
        }

        const tablaPedidos = document.getElementById('tablaPedidos');
        tablaPedidos.innerHTML = ''; 

        // Iterar sobre cada pedido y crear una fila en la tabla
        pedidos.forEach(pedido => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td id="FilaCliente">${pedido.nombre_cliente}</td>
                <td>${pedido.direccionEntrega}</td>
                <td>${pedido.barrio}</td>
                <td>${pedido.productosAEntregar}</td>
                <td>${pedido.Total}</td>
                <td>${new Date(pedido.fechaEntrega).toLocaleDateString("es-AR")}</td> <!-- Formatear la fecha -->
            `;
            tablaPedidos.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
    }
}

// Escuchar cambios en los campos de fecha para filtrar automáticamente
document.getElementById('fechaDesde').addEventListener('change', () => obtenerPedidos());
document.getElementById('fechaHasta').addEventListener('change', () => obtenerPedidos());


