document.addEventListener('DOMContentLoaded', async () => {
    await fetchClientes();
  });
                                                                //? fetch para traer los clientes
  async function fetchClientes() {
    try {
      const response = await fetch('http://localhost:3000/clientes');
      const clientes = await response.json();
  
      const clientTableBody = document.getElementById('clientTableBody');
      clientTableBody.innerHTML = ''; // Limpiar la tabla
  
      clientes.forEach((cliente) => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', cliente.id_cliente);
    

        const rowColor = cliente.estado === 0 ? '#d3d3d3' : '';
        const darBajaButtonDisabled = cliente.estado === 0 ? 'disabled' : '';
        const darAltaButtonDisabled = cliente.estado === 1 ? 'disabled' : ''; 
    
        row.innerHTML = `
            <td style="background-color: ${rowColor};">${cliente.id_cliente}</td>
            <td style="background-color: ${rowColor};">${cliente.nombre}</td>
            <td style="background-color: ${rowColor};">${cliente.apellido}</td>
            <td style="background-color: ${rowColor};">${cliente.direccion}</td>
            <td style="background-color: ${rowColor};">${cliente.barrio}
            <td style="background-color: ${rowColor};">${cliente.telefono}</td>
            <td style="background-color: ${rowColor};">
                <button class="btn btn-primary" id="editarBoton" onclick="openModifyModal('${cliente.id_cliente}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" id="darBajaBoton" ${darBajaButtonDisabled} onclick="darDeBaja('${cliente.id_cliente}')">
                    <i class="fas fa-user-slash"></i>
                </button>
                <button class="btn btn-success" id="darAltaBoton" ${darAltaButtonDisabled} onclick="darDeAlta('${cliente.id_cliente}')">
                    <i class="fas fa-user-check"></i>
                </button>
            </td>
        `;
        document.querySelector('table tbody').appendChild(row);
    });
    
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  }


//   function abrirModal() {
//     document.getElementById('modalClientes').style.display = 'block';
//     cargarClientes();
// }

// function closeModal() {
//     document.getElementById('modalClientes').style.display = 'none';
// }

function resetearCampos() {
  document.getElementById('agregarNombre').value = '';
  document.getElementById('agregarApellido').value = '';
  document.getElementById('agregarDireccion').value = '';
  document.getElementById('agregarTelefono').value = '';
  document.getElementById('agregarDNI').value = '';
  document.getElementById('agregarMail').value = '';
  document.getElementById('nuevoBarrio').value = '';
  document.getElementById('barrioSelect').value="";
  
}

document.getElementById('guardarCliente').addEventListener('click', function () {
    // Obtener los valores de los inputs
    const nombre = document.getElementById('agregarNombre').value;
    const apellido = document.getElementById('agregarApellido').value;
    const direccion = document.getElementById('agregarDireccion').value;
    const telefono = document.getElementById('agregarTelefono').value;
    const dni = document.getElementById('agregarDNI').value;
    const mail = document.getElementById('agregarMail').value;
    const barrio = document.getElementById('nuevoBarrio').value;
    console.log("Valor del barrio seleccionado:", barrio);

if (!barrio || barrio === "") {
    alert("Por favor, seleccione un barrio.");
    return;
}

    // Validar campos obligatorios
    if (!nombre || !apellido || !direccion || !telefono || !dni || !barrio) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
    }

    // Crear objeto del cliente
    const nuevoCliente = {
        nombre: nombre,
        apellido: apellido,
        direccion: direccion,
        telefono: telefono,
        dni: dni,
        mail: mail || null, // Mail no es obligatorio
        barrio: barrio // Nuevo campo
    };

    const confirmarGuardar = confirm("¿Desea agregar este cliente?");
    if (!confirmarGuardar) {
        return;
    }

    // Enviar solicitud POST
    fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCliente)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar el cliente');
            }
            return response.json();
        })
        .then(data => {
            console.log('Cliente agregado exitosamente:', data);
            alertaExito('¡Cliente agregado exitosamente!');

            fetchClientes();
            resetearCampos();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/barrios")
        .then(response => response.json())
        .then(data => {
            const selectBarrio = document.getElementById("agregarBarrio");
            selectBarrio.innerHTML = '<option value="" disabled selected>Seleccione un barrio</option>'; // Opción por defecto
            
            data.forEach(barrio => {
                const option = document.createElement("option");
                option.value = barrio.id; // Guardamos el ID del barrio
                option.textContent = barrio.barrio; // Mostramos el nombre del barrio
                selectBarrio.appendChild(option);
            });
        })
        .catch(error => console.error("Error al obtener barrios:", error));
});
document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/barrios")
        .then(response => response.json())
        .then(data => {
            const selectBarrio = document.getElementById("nuevoBarrio");
            selectBarrio.innerHTML = '<option value="" disabled selected>Seleccione un barrio</option>'; // Opción por defecto
            
            data.forEach(barrio => {
                const option = document.createElement("option");
                option.value = barrio.id; // Guardamos el ID del barrio
                option.textContent = barrio.barrio; // Mostramos el nombre del barrio
                selectBarrio.appendChild(option);
            });
        })
        .catch(error => console.error("Error al obtener barrios:", error));
});

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
  
  async function openModifyModal(id_cliente) {
    try {
        const response = await fetch(`http://localhost:3000/clientes/detalle/${id_cliente}`); 
        const cliente = await response.json();
    
        // Llena los campos del modal
        document.getElementById("modificarId").value = cliente.id_cliente;
        document.getElementById("modificarNombre").value = cliente.nombre;
        document.getElementById("modificarApellido").value = cliente.apellido;
        document.getElementById("modificarDireccion").value = cliente.direccion;
        document.getElementById("modificarTelefono").value = cliente.telefono;
        document.getElementById("modificarDNI").value = cliente.dni;
        document.getElementById("modificarMail").value = cliente.mail;

        // Seleccionar el barrio correctamente
        const barrioSelect = document.getElementById("agregarBarrio");
        Array.from(barrioSelect.options).forEach(option => {
            option.selected = option.value == cliente.barrio_id; // Usa `barrio_id` en lugar del nombre
        });

        // Abre el modal
        new bootstrap.Modal(document.getElementById("modifyClientModal")).show();
    } catch (error) {
        console.error('Error al abrir el modal de modificación:', error);
    }
}


//                                                                  ?funcion para buscar por nombre o apellido
document.getElementById("myInput").addEventListener("keyup", function() {

    const filter = this.value.toLowerCase();
    const tableBody = document.getElementById("clientTableBody");
    const rows = tableBody.getElementsByTagName("tr");
  
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        let match = false;
  
        // Suponiendo que el nombre está en la columna 0 y el apellido en la columna 1
        // Modificar los índices según la estructura de tu tabla
        const nameCell = cells[1]; // Columna de nombre
        const surnameCell = cells[2]; // Columna de apellido
  
        // Verifica si el nombre o el apellido coincide con el filtro
        if (nameCell && nameCell.textContent.toLowerCase().indexOf(filter) > -1) {
            match = true;
        }
        if (surnameCell && surnameCell.textContent.toLowerCase().indexOf(filter) > -1) {
            match = true;
        }
  
        // Muestra o esconde la fila según si hubo coincidencia
        if (match) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
        contarFilasVisibles();
    }
  });
  
// Agregar un evento al formulario
document.getElementById('modifyClientForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita la recarga de la página

    // Capturar los valores del formulario
    const idCliente = document.getElementById('modificarId').value;
    const nombre = document.getElementById('modificarNombre').value;
    const apellido = document.getElementById('modificarApellido').value;
    const direccion = document.getElementById('modificarDireccion').value;
    const telefono = document.getElementById('modificarTelefono').value;
    const dni = document.getElementById('modificarDNI').value;
    const mail = document.getElementById('modificarMail').value;
    const barrio = document.getElementById('agregarBarrio').value;

    // Crear un objeto con los datos
    const clienteData = {
        nombre: nombre,
        apellido: apellido,
        direccion: direccion,
        telefono: telefono,
        dni: dni,
        mail: mail,
        barrio:barrio,
    };
    const confirmar = confirm("¿Está seguro de que desea modificar este cliente?");
    if (!confirmar) {
        alertaError("Modificación cancelada");
        return;
    }

    // Realizar la petición fetch para actualizar el cliente
    fetch(`http://localhost:3000/clientes/${idCliente}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message); 
            alertaExito("¡Cliente modificado!")
            fetchClientes();
            
        } else {
            console.error('Error al actualizar el cliente:', data.message);
        }
    })
    .catch((error) => {
        console.error('Error en la petición:', error);
    });
});
let currentFilter = 'todos'; 

function getCurrentFilter() {
    return currentFilter;
}

// Función para cambiar el filtro
function filtrarClientes(filtro) {
    currentFilter = filtro;  // Actualizar el filtro actual

    let url = 'http://localhost:3000/clientes'; // Endpoint base
    if (filtro === 'activos') {
        url = 'http://localhost:3000/clientes/estado/1';
    } else if (filtro === 'inactivos') {
        url = 'http://localhost:3000/clientes/estado/0';
    }

    // Realizar la solicitud a la API
    fetch(url)
        .then(response => response.json())
        .then(clientes => {
            // Limpiar la tabla
            const clientTableBody = document.getElementById('clientTableBody');
            clientTableBody.innerHTML = ''; 

            // Llenar la tabla con los clientes filtrados
            clientes.forEach(cliente => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', cliente.id_cliente);
                const rowColor = cliente.estado === 0 ? '#d3d3d3' : ''; // Color para inactivos
                row.innerHTML = `
                    <td style="background-color: ${rowColor};">${cliente.id_cliente}</td>
                    <td style="background-color: ${rowColor};">${cliente.nombre}</td>
                    <td style="background-color: ${rowColor};">${cliente.apellido}</td>
                    <td style="background-color: ${rowColor};">${cliente.direccion}</td>
                    <td style="background-color: ${rowColor};">${cliente.barrio}</td>
                    <td style="background-color: ${rowColor};">${cliente.telefono}</td>
                    <td style="background-color: ${rowColor};">
                        <button class="btn btn-primary" onclick="openModifyModal('${cliente.id_cliente}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger darBajaBoton" ${cliente.estado === 0 ? 'disabled' : ''} onclick="darDeBaja('${cliente.id_cliente}')">
                            <i class="fas fa-user-slash"></i>
                        </button>
                        <button class="btn btn-success darAltaBoton" ${cliente.estado === 1 ? 'disabled' : ''} onclick="darDeAlta('${cliente.id_cliente}')">
                            <i class="fas fa-user-check"></i>
                        </button>
                    </td>
                `;
                clientTableBody.appendChild(row);
                resetearCampos();
            });
        })
        .catch(error => {
            console.error('Error al filtrar clientes:', error);
        });
}

//                                                          ?Función para dar de alta a un cliente
function darDeAlta(idCliente) {
    const confirmar = confirm("¿Desea dar de alta este cliente?");
    if (confirmar) {
        fetch(`http://localhost:3000/clientes/${idCliente}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: 1 })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al dar de alta el cliente');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);

            // Actualizar la interfaz de usuario
            const row = document.querySelector(`tr[data-id='${idCliente}']`);
            row.style.backgroundColor = ''; // Color normal para activos

            // Habilitar el botón de dar de baja
            const darBajaBoton = row.querySelector('.darBajaBoton');
            if (darBajaBoton) {
                darBajaBoton.disabled = false;
                darBajaBoton.classList.remove('disabled');
            }

            // Mantener el filtro actual
            filtrarClientes(getCurrentFilter());
        })
        .catch(error => {
            console.error('Error al actualizar el estado del cliente:', error);
        });
    }
}

//                                                          ?Función para dar de baja a un cliente
function darDeBaja(idCliente) {
    const confirmar = confirm("¿Desea dar de baja este cliente?");
    if (confirmar) {
        fetch(`http://localhost:3000/clientes/${idCliente}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: 0 })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al dar de baja el cliente');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);

            // Actualizar la interfaz de usuario
            const row = document.querySelector(`tr[data-id='${idCliente}']`);
            row.style.backgroundColor = '#d3d3d3'; // Color para inactivos

            // Deshabilitar el botón de dar de alta
            const darAltaBoton = row.querySelector('.darAltaBoton');
            if (darAltaBoton) {
                darAltaBoton.disabled = false;
                darAltaBoton.classList.remove('disabled');
            }

            // Mantener el filtro actual
            filtrarClientes(getCurrentFilter());
        })
        .catch(error => {
            console.error('Error al actualizar el estado del cliente:', error);
        });
    }
}

  
  //                                                                ?Función para contar las filas visibles
function contarFilasVisibles() {
    const tableBody = document.getElementById("clientTableBody");
    const rows = tableBody.getElementsByTagName("tr");
    let filasVisibles = 0;
  
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].style.display !== "none") { // Solo contar filas visibles
            filasVisibles++;
        }
    }
    const clientesTotales = document.getElementById("clientesTotales");
  clientesTotales.textContent = `Cantidad de clientes visibles:${filasVisibles}`;
    console.log("Cantidad de filas visibles: ", filasVisibles);
  }
  
  // crear un observaodr de dom
  const observer = new MutationObserver(function(mutationsList, observer) {
    // Llamar a la función cada vez que haya un cambio en el DOM
    contarFilasVisibles();
  });
  
  
  const config = { childList: true, subtree: true };
  
  const tableBody = document.getElementById("clientTableBody");
  observer.observe(tableBody, config);
  
  
  
  // Obtener los elementos del DOM
const barrioSelect = document.getElementById("barrioSelect");
const clientesTotales = document.getElementById("clientesTotales");
const clientTableBody = document.getElementById("clientTableBody");

// Función para cargar los clientes del barrio seleccionado
const cargarClientesPorBarrio = async () => {
    const barrioSeleccionado = barrioSelect.value;
    
    // Si no se ha seleccionado un barrio, no hacer nada
    if (!barrioSeleccionado) {
        clientesTotales.textContent = '0';
        clientTableBody.innerHTML = ''; // Limpiar la tabla
        return;
    }

    try {
        // Realizar la solicitud al backend para obtener los clientes del barrio seleccionado
        const response = await fetch(`http://localhost:3000/clientes/idBarrio/${barrioSeleccionado}`);
        const clientes = await response.json();

        // Mostrar el número de clientes
        clientesTotales.textContent = clientes.length;

        // Limpiar la tabla actual
        clientTableBody.innerHTML = '';

        // Llenar la tabla con los clientes del barrio seleccionado
        clientes.forEach((cliente) => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', cliente.id_cliente);

            // Cambiar color de fila si el cliente está inactivo
            const rowColor = cliente.estado === 0 ? '#d3d3d3' : '';

            // Botones de dar baja y dar alta
            const darBajaButtonDisabled = cliente.estado === 0 ? 'disabled' : '';
            const darAltaButtonDisabled = cliente.estado === 1 ? 'disabled' : '';

            row.innerHTML = `
                <td style="background-color: ${rowColor};">${cliente.id_cliente}</td>
                <td style="background-color: ${rowColor};">${cliente.nombre}</td>
                <td style="background-color: ${rowColor};">${cliente.apellido}</td>
                <td style="background-color: ${rowColor};">${cliente.direccion}</td>
                <td style="background-color: ${rowColor};">${cliente.barrio}</td>
                <td style="background-color: ${rowColor};">${cliente.telefono}</td>
                <td style="background-color: ${rowColor};">
                    <button class="btn btn-primary" id="editarBoton" onclick="openModifyModal('${cliente.id_cliente}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" id="darBajaBoton" ${darBajaButtonDisabled} onclick="darDeBaja('${cliente.id_cliente}')">
                        <i class="fas fa-user-slash"></i>
                    </button>
                    <button class="btn btn-success" id="darAltaBoton" ${darAltaButtonDisabled} onclick="darDeAlta('${cliente.id_cliente}')">
                        <i class="fas fa-user-check"></i>
                    </button>
                </td>
            `;

            // Añadir la fila a la tabla
            clientTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
    }
};
55

// Escuchar el cambio de selección en el select
barrioSelect.addEventListener("change", cargarClientesPorBarrio);

// Llamar a la función para cargar los clientes inicialmente (puede estar vacío si no hay un barrio seleccionado)
cargarClientesPorBarrio();

document.addEventListener('DOMContentLoaded', async () => {
    const barrioSelect = document.getElementById('barrioSelect');
    
    try {
        // Realiza la solicitud para obtener los barrios
        const response = await fetch('http://localhost:3000/barrios');
        if (!response.ok) throw new Error('Error al obtener los barrios');
        
        const barrios = await response.json();
        
        // Agrega las opciones de barrio al select
        barrios.forEach(barrio => {
            const option = document.createElement('option');
            option.value = barrio.id;
            option.textContent = barrio.barrio;
            barrioSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al cargar los barrios');
    }
});