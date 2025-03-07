document.addEventListener("DOMContentLoaded", async () => {
    async function renderizarPedidosDeHoy() {
        const tablaPedidos = document.querySelector("table tbody");
        const fechaHoy = new Date().toISOString().split('T')[0]; // Fecha de hoy
        console.log("Fecha de hoy:", fechaHoy);

        try {
            // intenta obtener el endpoint
            const responsePedidos = await fetch('http://localhost:3000/pedidostodos');
            if (!responsePedidos.ok) {
                throw new Error('Error al obtener los pedidos. Estado: ' + responsePedidos.status);
            }

            const pedidos = await responsePedidos.json();
            console.log("Pedidos obtenidos:", pedidos);

            //? filtrar pedidos solo los q son de hoy
            const pedidosDeHoy = pedidos.filter(pedido => pedido.fechaEntrega.split('T')[0] === fechaHoy);
            console.log("Pedidos de hoy:", pedidosDeHoy);

            //? verific si hay pedidos para el día de hoy
            if (pedidosDeHoy.length === 0) {
                console.log("No hay pedidos para la fecha de hoy.");
                tablaPedidos.innerHTML = "<tr><td colspan='4'>No hay pedidos para hoy</td></tr>";
                return;
            }

            //? renderizar pedids
            for (const pedido of pedidosDeHoy) {
                //obtener nombre cliente x id
                const nombreCliente = await obtenerNombreClientePorId(pedido.id_cliente);
                const rowColor = pedido.estado === 0 ? '#d3d3d3' : '';
                const fila = document.createElement("tr");
                fila.id = pedido.id_pedido;
                fila.innerHTML = `
                    <td class="${pedido.id_pedido}" id="${pedido.id_pedido}" style=background-color: ${rowColor};">${nombreCliente || 'Cliente no encontrado'}</td>
                    <td class="${pedido.id_pedido}" id="${pedido.id_pedido}" style="background-color: ${rowColor};">${pedido.direccionEntrega}</td>
                    <td class="${pedido.id_pedido}" id="${pedido.id_pedido}" style="background-color: ${rowColor};">${pedido.barrio || 'Sin barrio'}</td>
                    <td class="${pedido.id_pedido}" id="${pedido.id_pedido}" style="background-color: ${rowColor};">${pedido.productosAEntregar}</td>
                    <td class="${pedido.id_pedido} d-flex" id="${pedido.id_pedido}" style="background-color: ${rowColor};">
                    <label class="checkbox-btn">
                        <label for="checkbox-${pedido.id_pedido}"></label>
                        <input class="mt-4" id="checkbox-${pedido.id_pedido}" type="checkbox"  ${pedido.estado === 0 ? 'checked' : ''}>
                        <span class="checkmark mt-2"></span>
                    </label>
                    <button class="btn btn-link btn-lg" title="Imprimir recibo en PDF" id="btnPDF${pedido.id_pedido}"><i class="fa-solid fa-file-invoice"></i></button>
                    </td>
                `;
                const buttonPDF = fila.querySelector(`#btnPDF${pedido.id_pedido}`);
                buttonPDF.addEventListener('click', async () => {
                    const nombreCliente = await obtenerNombreClientePorId(pedido.id_cliente);
                    const total = pedido.Total;
                    const fechaEntregaFormateada = formatearFecha(pedido.fechaEntrega);
                
                    const nuevaVentana = window.open('', '_blank');
                    nuevaVentana.document.write(`
                        <html>
                            <head>
                                <title>Recibo del pedido con ID ${pedido.id_pedido}</title>
                                <style>
                                    body { font-family: Arial, sans-serif; }
                                    h4 { color: #333; }
                                    p { font-size: 16px; }
                                    .detalle-pedido { 
                                        width: 350px;  
                                        border: 2px solid black; 
                                        padding: 10px; 
                                        box-sizing: border-box; 
                                    }
                                </style>
                            </head>
                            <body>
                                <div id="contenidoPDF" class="detalle-pedido">
                                    <img src="../media/logonegro.png" alt="Logo" width="100">
                                    <h4>Recibo de entrega del pedido del día: ${fechaEntregaFormateada}</h4>
                                    <p>Se consta por medio de este documento que el sr/sra: <strong>${nombreCliente || 'Cliente no encontrado'}</strong></p>
                                    <p>Ha abonado la suma de <strong>$${total}</strong> correspondiente al monto total por los siguientes productos: <strong>${pedido.productosAEntregar}</strong></p>
                                    <p>Con dirección de entrega: <strong>${pedido.direccionEntrega}</strong></p>
                                    <p>Gracias por su compra</p>
                                </div>
                                <button id="btnDownload">Descargar PDF</button>
                                <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
                                <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
                                <script>
                                    document.getElementById('btnDownload').addEventListener('click', () => {
                                        const { jsPDF } = window.jspdf;
                
                                        html2canvas(document.getElementById('contenidoPDF'),{scale:3 }).then(canvas => {
                                            const imgData = canvas.toDataURL('image/png');
                                            const doc = new jsPDF();
                                            const imgWidth = 100; // Ancho de la imagen en el PDF
                                            const pageHeight = 200;
                                            const imgHeight = (canvas.height * imgWidth) / canvas.width;
                                            let position = 10; // Margen superior
                
                                            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                                            doc.save('pedido_${pedido.id_pedido}_Fecha:${fechaEntregaFormateada}.pdf');
                                        });
                                    });
                                </script>
                            </body>
                        </html>
                    `);
                
                    nuevaVentana.document.close();
                });
                
                
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
}


                // Agregar el evento change para el checkbox
                const checkbox = fila.querySelector("input[type='checkbox']");
                checkbox.addEventListener('change', async (event) => {
                    const nuevoEstado = event.target.checked ? 0 : 1; 
                    await actualizarEstadoPedido(pedido.id_pedido, nuevoEstado);
                    // Cambiar el color de la fila en tiempo real
                    // console.log("fila color", filaColor)
                });
                tablaPedidos.appendChild(fila);
                
            }
        } catch (error) {
            console.error("Error al renderizar pedidos de hoy:", error);
        }
    }

    // función para obtener el nombre del cliente por ID
    async function obtenerNombreClientePorId(idCliente) {
        try {
            const responseClientes = await fetch('http://localhost:3000/clientes');
            if (!responseClientes.ok) {
                throw new Error('Error al obtener los clientes. Estado: ' + responseClientes.status);
            }

            const clientes = await responseClientes.json();
            console.log("Clientes obtenidos:", clientes);

            // Buscar el cliente por ID
            const clienteEncontrado = clientes.find(cliente => cliente.id_cliente === idCliente);

            return clienteEncontrado ? `${clienteEncontrado.nombre} ${clienteEncontrado.apellido}` : null;
        } catch (error) {
            console.error("Error al obtener el nombre del cliente:", error);
            return null;
        }
    }
    
       async function actualizarEstadoPedido(idPedido, nuevoEstado) {
        try {
            const response = await fetch(`http://localhost:3000/pedidos/actualizarEstado/${idPedido}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado del pedido. Estado: ' + response.status);
            }

            const data = await response.json();
            console.log(data.message); // Mensaje de éxito
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
        }
    }

    
    // llamar a la función para renderizar pedidos de hoy al cargar la página
    renderizarPedidosDeHoy();
    
});
