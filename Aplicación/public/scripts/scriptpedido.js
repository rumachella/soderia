let clientes = []; // Crear una variable global para almacenar los clientes
let totalProductos = 0; // Variable global para almacenar el total de productos
let parrafoTipo= document.getElementById("parrafoTipo")
        parrafoTipo.innerHTML="Viendo TODOS los pedidos"
// async function obtenerPedidos(orden = 'fecha') {
//     try {
//         const response = await fetch('http://localhost:3000/pedidosnombre'); // Asegúrate de que la URL es correcta
//         if (!response.ok) {
//             throw new Error('Error al obtener los pedidos');
//         }
//         pedidos = await response.json(); // variable global para pediods

//         // Ordenar los pedidos según el criterio
//         if (orden === 'fecha') {
//             pedidos.sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega));
//         } else if (orden === 'precio') {
//             pedidos.sort((a, b) => b.Total - a.Total); 
//         } else if (orden === 'cliente') {
//             pedidos.sort((a, b) => a.nombre_cliente.localeCompare(b.nombre_cliente));
//         }

//         const tablaPedidos = document.getElementById('tablaPedidos');
//         tablaPedidos.innerHTML = ''; 
        
     
//         // Iterar sobre cada pedido y crear una fila en la tabla
//         pedidos.forEach(pedido => {
//             const fila = document.createElement('tr');
//             fila.innerHTML = `
//                 <td id="FilaCliente">${pedido.nombre_cliente}</td>
//                 <td>${pedido.direccionEntrega}</td>
//                 <td>${pedido.barrio}</td>
//                 <td>${pedido.productosAEntregar}</td>
//                 <td>${pedido.Total}</td>
//                 <td>${new Date(pedido.fechaEntrega).toLocaleDateString("es-AR")}</td> <!-- Formatear la fecha -->
//             `;
//             tablaPedidos.appendChild(fila);
//         });
//     } catch (error) {
//         console.error('Error al obtener los pedidos:', error);
//     }
// }

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
            
            alertaExito('Pedido agregado con éxito');

            } catch (error) {
            console.error('Error al agregar el pedido:', error);
            alertaError('Error al agregar el pedido');
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
    document.getElementById('fechaDesde').value = '';
    document.getElementById('fechaHasta').value = '';
}


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
    const rows = tableBody.querySelectorAll("tr"); 
  
    rows.forEach(row => {
        const cell = row.querySelector("td#FilaCliente"); 
        
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

let pedidos = []; 


async function obtenerPedidos(orden = 'fecha') {
    try {
        const response = await fetch('http://localhost:3000/pedidosnombre'); 
        if (!response.ok) {
            throw new Error('Error al obtener los pedidos');
        }
        pedidos = await response.json(); 

        // Obtener las fechas desde y hasta
        const fechaDesde = document.getElementById('fechaDesde').value;
        const fechaHasta = document.getElementById('fechaHasta').value;

        // Filtrar los pedidos por fecha
        if (fechaDesde || fechaHasta) {
            pedidos = pedidos.filter(pedido => {
                const fechaEntrega = new Date(pedido.fechaEntrega);
                const fechaDesdeInicio = fechaDesde ? new Date(fechaDesde + 'T00:00:00') : null;
                const fechaHastaFin = fechaHasta ? new Date(fechaHasta + 'T23:59:59') : null;

                if (fechaDesdeInicio && fechaEntrega < fechaDesdeInicio) return false; 
                if (fechaHastaFin && fechaEntrega > fechaHastaFin) return false;

                return true; 
            });

            // Actualizar el texto del párrafo con el rango seleccionado
            const parrafoTipo = document.getElementById('parrafoTipo');
            const desdeTexto = fechaDesde 
             ? `desde ${new Date(fechaDesde).toISOString().slice(0, 10).split('-').reverse().join('/')}` 
             : '';
            const hastaTexto = fechaHasta 
              ? `hasta ${new Date(fechaHasta).toISOString().slice(0, 10).split('-').reverse().join('/')}` 
             : '';

            parrafoTipo.innerHTML = `Viendo pedidos ${desdeTexto} ${hastaTexto}`.trim();
        } else {
            document.getElementById('parrafoTipo').innerHTML = 'Viendo TODOS los pedidos';
        }

        // Ordenar los pedidos según el criterio
        if (orden === 'fecha') {
            pedidos.sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega));
        } else if (orden === 'precio') {
            pedidos.sort((a, b) => b.Total - a.Total);
        } else if (orden === 'cliente') {
            pedidos.sort((a, b) => a.nombre_cliente.localeCompare(b.nombre_cliente));
        }

        // Mostrar los pedidos en la tabla
        const tablaPedidos = document.getElementById('tablaPedidos');
        tablaPedidos.innerHTML = '';

        pedidos.forEach(pedido => {
            const estadoTexto = pedido.estado === 1 ? "Sin entregar" : "Entregado";
            const fila = document.createElement('tr');
            fila.innerHTML = `
                
                <td id="FilaCliente">${pedido.nombre_cliente}</td>
                <td>${pedido.direccionEntrega}</td>
                <td>${pedido.barrio}</td>
                <td>${pedido.productosAEntregar}</td>
                <td>${pedido.Total}</td>
                <td>${new Date(pedido.fechaEntrega).toLocaleDateString("es-AR")}</td>
                <td>${estadoTexto}</td>
                <td class="botonModificar"> 
                <button onclick="cargarDatosPedido(${pedido.id_pedido})" class="btn btn-secondary" title="Modificar el pedido"> <i class="fa-solid fa-pen"></i> </button>
            <button onclick="cambiarEstadoPedido(${pedido.id_pedido})" class="btn btn-success" title="Cambiar estado del pedido"> <i class="fa-solid fa-check"></i> </button>

                </td>
            `;
            tablaPedidos.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
    }
}
async function cambiarEstadoPedido(idPedido) {
    const pedido = pedidos.find(p => p.id_pedido === idPedido);

    if (!pedido) {
        alertaError('Pedido no encontrado');
        return;
    }

    const nuevoEstado = pedido.estado === 1 ? 0 : 1;

    try {
        const response = await fetch(`http://localhost:3000/pedidos/actualizarEstado/${idPedido}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado }),
        });

        if (!response.ok) throw new Error('Error al cambiar el estado del pedido');

        alertaExito('Estado del pedido actualizado correctamente');
        obtenerPedidos(); // Refrescar la lista
    } catch (error) {
        alertaError('Error al cambiar el estado del pedido:', error);
    }
}






// function filtrarPedidos(estado) {
//     const url = `http://localhost:3000/pedidoPorEstado?estado=${estado}`;

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data); 
//         })
//         .catch(error => {
//             console.error('Error al filtrar pedidos:', error);
//         });


// }
function filtrarPedidos(estado) {
    const url = `http://localhost:3000/pedidoPorEstado?estado=${estado}`;
    parrafoTipo=document.getElementById("parrafoTipo")
    if(estado==0){
        parrafoTipo.innerHTML="Viendo pedidos ENTREGADOS"
        limpiarCampos();
    }else{
    parrafoTipo.innerHTML="Viendo pedidos SIN ENTREGAR"
    limpiarCampos();
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            pedidos = data; 

            pedidos.sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega));

            const tablaPedidos = document.getElementById('tablaPedidos');
            tablaPedidos.innerHTML = ''; 

            pedidos.forEach(pedido => {
                const estadoTexto = pedido.estado === 1 ? "Sin entregar" : "Entregado";
                const fila = document.createElement('tr');
                fila.innerHTML = `

                    <td id="FilaCliente">${pedido.nombre_cliente}</td>
                    <td>${pedido.direccionEntrega}</td>
                    <td>${pedido.barrio}</td>
                    <td>${pedido.productosAEntregar}</td>
                    <td>${pedido.Total}</td>
                    <td>${new Date(pedido.fechaEntrega).toLocaleDateString("es-AR")}</td>
                    <td>${estadoTexto}</td>
                    <td class="botonModificar">
                    <button onclick="modificarPedido()" class="btn btn-secondary" title="Modificar el pedido"> <i class="fa-solid fa-pen"></i> </button>
                    <button onclick="cambiarEstadoPedido(${pedido.id_pedido})" class="btn btn-success" title="Cambiar estado del pedido"> <i class="fa-solid fa-check"></i> </button>
                    </td>
                `;
                tablaPedidos.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al filtrar pedidos:', error);
        });
}


function mostrarTodos() {
    // Limpiar los campos de filtro (fecha y otros)
    document.getElementById('fechaDesde').value = '';
    document.getElementById('fechaHasta').value = '';
   parrafoTipo= document.getElementById("parrafoTipo")
   parrafoTipo.innerHTML="Viendo TODOS los pedidos"


    obtenerPedidos();
}


document.getElementById('fechaDesde').addEventListener('change', () => obtenerPedidos());
document.getElementById('fechaHasta').addEventListener('change', () => obtenerPedidos());

function modificarPedido(idPedido) {
    // Encontrar el pedido por ID
    const pedido = pedidos.find(p => p.id_pedido === idPedido);

    if (!pedido) {
        alertaError('Pedido no encontrado');
        return;
    }

    // Rellenar los campos del modal
    document.getElementById('idPedidoModificar').value = pedido.id_pedido;
    document.getElementById('clienteModificar').value = pedido.nombre_cliente;
    document.getElementById('direccionModificar').value = pedido.direccionEntrega;
    document.getElementById('clienteModificar').dataset.idCliente = pedido.id_cliente; 

    // Seleccionar el barrio correspondiente en el select
    const barrioSelect = document.getElementById('barrioModificar');
    barrioSelect.value = pedido.barrio;

    document.getElementById('productosModificar').value = pedido.productosAEntregar;
    document.getElementById('totalModificar').value = pedido.Total;
    document.getElementById('fechaModificar').value = new Date(pedido.fechaEntrega).toISOString().slice(0, 10);

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modificarPedidoModal'));
    modal.show();
}

async function guardarModificacion() {
    // Obtener los valores del formulario
    const idPedido = parseInt(document.getElementById('idPedidoModificar').value);
    const idCliente = document.getElementById('clienteModificar').value; 
    const direccion = document.getElementById('direccionModificar').value;
    const barrio = document.getElementById('barrioModificar').value;
    const productos = document.getElementById('productosModificar').value;
    const total = parseFloat(document.getElementById('totalModificar').value);
    const fechaEntrega = document.getElementById('fechaModificar').value;

 
    const pedidoModificado = {
        id_cliente: parseInt(idCliente),
        direccionEntrega: direccion,
        productosAEntregar: productos,
        fechaEntrega: fechaEntrega,
        total: total,
        barrio: barrio,
        id_pedido: idPedido
    };
    console.log({
        idPedido,
        idCliente,
        direccion,
        barrio,
        productos,
        total,
        fechaEntrega
    });
    
    // console.log(pedidoModificado);

    try {
        // Enviar la solicitud PUT al servidor
        const response = await fetch(`http://localhost:3000/pedidos/${idPedido}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedidoModificado)
        });

        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el pedido');
        }

        const result = await response.json();
        alertaExito(result.message || 'Pedido actualizado correctamente');

        // Cerrar el modal

        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modificarPedidoModal'));
            if (modal) {
                modal.hide();
            }
        }, 500); 
        obtenerPedidos();

    } catch (error) {
        console.error('Error al guardar la modificación:', error);
        alertaError(`Hubo un problema al guardar la modificación: ${error.message}`);
    }
}



// Manejar el envío del formulario del modal
// document.getElementById('formModificarPedido').addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const idPedido = document.getElementById('idPedidoModificar').value;
//     const datosActualizados = {
//         nombre_cliente: document.getElementById('clienteModificar').value,
//         direccionEntrega: document.getElementById('direccionModificar').value,
//         barrio: document.getElementById('barrioModificar').value,
//         productosAEntregar: document.getElementById('productosModificar').value,
//         Total: parseFloat(document.getElementById('totalModificar').value),
//         fechaEntrega: document.getElementById('fechaModificar').value,
//     };

//     try {
//         const response = await fetch(`http://localhost:3000/pedidos/${idPedido}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(datosActualizados),
//         });

//         if (!response.ok) throw new Error('Error al actualizar el pedido');

//         alert('Pedido actualizado correctamente');
//         obtenerPedidos(); // Refrescar la lista
//     } catch (error) {
//         console.error('Error al modificar el pedido:', error);
//     }
// });


function alertaExito(message) {
    const alertElement = document.getElementById('customAlert');
    
    alertElement.textContent = message;
    
   
    alertElement.style.display = 'block';
    alertElement.classList.add('show');
  
   
    setTimeout(() => {
      alertElement.classList.remove('show');
      setTimeout(() => {
        alertElement.style.display = 'none';
      }, 300); 
    }, 1750); 
  }

  function alertaError(message) {
    const alertElement = document.getElementById('errorAlert');
    
    alertElement.textContent = message;
    
    
    alertElement.style.display = 'block';
    alertElement.classList.add('show');
  
    setTimeout(() => {
      alertElement.classList.remove('show');
      setTimeout(() => {
        alertElement.style.display = 'none';
      }, 300);
    }, 1750); 
  }

  async function cargarDatosPedido(idPedido) {
    try {
        // Obtener la información del pedido desde la API
        const response = await fetch(`http://localhost:3000/pedidos/${idPedido}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del pedido');
        }

        const pedido = await response.json();

        // Llenar los campos bloqueados con los datos actuales
        document.getElementById('idPedidoModificar').value = pedido.id_pedido;
        document.getElementById('direccionModificar').value = pedido.direccionEntrega;
        document.getElementById('barrioModificar').value = pedido.barrio;
        document.getElementById('productosModificar').value = pedido.productosAEntregar;
        document.getElementById('totalModificar').value = pedido.Total;
        document.getElementById('fechaModificar').value = new Date(pedido.fechaEntrega).toISOString().split('T')[0];
        console.log(pedido.fechaEntrega);
        

        // Bloquear los campos (readonly y disabled)
        document.getElementById('direccionModificar').setAttribute('readonly', true);
        // document.getElementById('barrioModificar').setAttribute('disabled', true);
        document.getElementById('productosModificar').setAttribute('readonly', true);
        document.getElementById('totalModificar').setAttribute('readonly', true);
        // document.getElementById('fechaModificar').setAttribute('readonly', true);

        // Obtener la lista de clientes
        const clientesResponse = await fetch(`http://localhost:3000/clientes`);
        if (!clientesResponse.ok) {
            throw new Error('Error al obtener la lista de clientes');
        }

        const clientes = await clientesResponse.json();
        const selectClientes = document.getElementById('clienteModificar');
        selectClientes.innerHTML = ''; // Limpiar opciones previas

        // Agregar opciones al select de clientes
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id_cliente;
            option.textContent = `${cliente.nombre} ${cliente.apellido}`;
        
            // Seleccionar automáticamente el cliente actual
            if (cliente.id_cliente === pedido.id_cliente) {
                option.selected = true;
                // Actualizar barrio y dirección con los valores del cliente actual
                document.getElementById('barrioModificar').value = cliente.barrio;
                document.getElementById('direccionModificar').value = cliente.direccion;
            }
        
            selectClientes.appendChild(option);
        });
        

        // Evento para actualizar barrio y dirección cuando se cambie el cliente
        selectClientes.addEventListener('change', function () {
            const clienteSeleccionado = clientes.find(cliente => cliente.id_cliente == selectClientes.value);
            if (clienteSeleccionado) {
                document.getElementById('barrioModificar').value = clienteSeleccionado.barrio;
                document.getElementById('direccionModificar').value = clienteSeleccionado.direccion;
            }
        });

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('modificarPedidoModal'));
        modal.show();

    } catch (error) {
        console.error('Error al cargar los datos del pedido:', error);
        alertaError('No se pudo cargar el pedido');
    }
}

