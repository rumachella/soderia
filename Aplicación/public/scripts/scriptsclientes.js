document.addEventListener('DOMContentLoaded', async () => {
    await fetchClientes();
  });
  
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
}

document.getElementById('guardarCliente').addEventListener('click', function () {
    // Obtener los valores de los inputs
    const nombre = document.getElementById('agregarNombre').value;
    const apellido = document.getElementById('agregarApellido').value;
    const direccion = document.getElementById('agregarDireccion').value;
    const telefono = document.getElementById('agregarTelefono').value;
    const dni =  document.getElementById('agregarDNI').value;
    const mail = document.getElementById('agregarMail').value;

    // Validar
    console.log("valores",nombre, apellido, direccion, telefono, dni, mail)
  if (!nombre || !apellido || !direccion  || !telefono || !dni) {
    alert("Por favor, complete todos los campos obligatorios.");
    return;
}


    // Creo objeto
    const nuevoCliente = {
        nombre: nombre,
        apellido: apellido,
        direccion: direccion,
        telefono: telefono,
        dni: dni,
        mail: mail || null //?mail no obligatorio
    };
    const confirmarGuardar = confirm("¿Desea agregar este cliente?");
    if (!confirmarGuardar){
      return;
    } 
    // solicitud POST
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
        alert("✅Cliente agregado exitosamente.");
        fetchClientes(); 
        resetearCampos();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

async function openModifyModal(id_cliente) {
    try {
        const response = await fetch(`http://localhost:3000/clientes/${id_cliente}`); 
        const cliente = await response.json();
    

    // Llena los campos del modal
    document.getElementById("modificarId").value = id_cliente;
    document.getElementById("modificarNombre").value = cliente.nombre;
    document.getElementById("modificarApellido").value = cliente.apellido;
    document.getElementById("modificarDireccion").value = cliente.direccion;
    document.getElementById("modificarTelefono").value = cliente.telefono;
    document.getElementById("modificarDNI").value = cliente.dni;
    document.getElementById("modificarMail").value = cliente.mail;

    // Abre el modal
    new bootstrap.Modal(document.getElementById("modifyClientModal")).show();
    } catch (error) {
        console.error('Error al abrir el modal de modificación:', error);
    }
    
}

// filtrar clientes
document.getElementById("myInput").addEventListener("keyup", function() {

  const filter = this.value.toLowerCase();
  const tableBody = document.getElementById("clientTableBody");
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
})
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

    // Crear un objeto con los datos
    const clienteData = {
        nombre: nombre,
        apellido: apellido,
        direccion: direccion,
        telefono: telefono,
        dni: dni,
        mail: mail,
    };

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
            alert("✅Cliente modificado exitosamente.");
            fetchClientes();
            
        } else {
            console.error('Error al actualizar el cliente:', data.message);
        }
    })
    .catch((error) => {
        console.error('Error en la petición:', error);
    });
});
function darDeBaja(idCliente) {
    const confirmar = confirm("¿Desea dar de baja este cliente?");
    
    if (confirmar) {
        // Cambia el estado del cliente a 0 (inactivo) en la base de datos
        fetch(`http://localhost:3000/clientes/${idCliente}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: 0 }) // Solo envía el nuevo estado
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al dar de baja el cliente');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); 

            //actualiza interfaz
            const row = document.querySelector(`tr[data-id='${idCliente}']`);
            
            // cambia el color de fondo a gris para indicar inactivo
            row.style.backgroundColor = '#d3d3d3'; 
            fetchClientes()
            // deshabilita el botón
            const darBajaBoton = row.querySelector('#darBajaBoton');
            if (darBajaBoton) {
                darBajaBoton.disabled = true; 
                darBajaBoton.classList.add('disabled'); 
            }
        })
        .catch(error => {
            console.error('Error al actualizar el estado del cliente:', error);
        });
    }
}
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

            // actualiza la interfaz de usuario
            const row = document.querySelector(`tr[data-id='${idCliente}']`); 
            
        //color normal
            row.style.backgroundColor = '';
            fetchClientes()
            
            // habilita el botón de dar de baja
            const darBajaBoton = row.querySelector('#darBajaBoton');
            if (darBajaBoton) {
                darBajaBoton.disabled = false; 
                darBajaBoton.classList.remove('disabled'); 
            }
        })
        .catch(error => {
            console.error('Error al actualizar el estado del cliente:', error);
        });
    }
}

