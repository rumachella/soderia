// document.addEventListener("DOMContentLoaded", () => {
//     fetch('http://localhost:3000/clientesBarrio/barrios')
//         .then((response) => {
//             if (!response.ok) throw new Error('Error al obtener los datos');
//             return response.json();
//         })
//         .then((clientesPorBarrio) => {
//             console.log(clientesPorBarrio)
//             Object.entries(clientesPorBarrio).forEach(([barrio, clientes]) => {
//                 const tablaBody = document.querySelector(`#tabla${barrio.replace(/\s+/g, '')} tbody`);
//                 const contadorParrafo = document.querySelector(`#parrafo${barrio.replace(/\s+/g, '')}`);
//                 console.log(`#tabla${barrio.replace(/\s+/g, '')} tbody`)
//                 console.log(`#parrafo${barrio.replace(/\s+/g, '')}`)
                
//                 if (tablaBody && contadorParrafo) {
//                     // Vaciar la tabla antes de llenarla
//                     tablaBody.innerHTML = '';

//                     // Agregar filas a la tabla
//                     clientes.forEach(({ nombre, direccion }) => {
//                         const fila = document.createElement('tr');
//                         fila.innerHTML = `<td>${nombre}</td><td>${direccion}</td>`;
//                         tablaBody.appendChild(fila);
//                     });

//                     // Actualizar el contador de clientes
//                     contadorParrafo.textContent = `Cantidad de clientes: ${clientes.length}`;
//                 }
//             });
//         })
//         .catch((error) => {
//             console.error('Error al cargar los clientes:', error);
//         });
// });

// // function mostrarModal() {
// //     const botonesVisualizar = document.querySelectorAll(".btn-secondary");
  
// //     botonesVisualizar.forEach((boton, index) => {
// //         boton.addEventListener("click", () => {
// //             // Obtener la tabla del barrio correspondiente
// //             const tablaOriginal = document.querySelectorAll(".tabla-barrio")[index];
// //             const tablaClonada = tablaOriginal.querySelector("table").cloneNode(true);

// //             // Limpiar y preparar el modal
// //             const contenedorTablaCompleta = document.getElementById("contenedorTablaCompleta");
// //             contenedorTablaCompleta.innerHTML = ""; // Limpiar contenido previo
// //             contenedorTablaCompleta.appendChild(tablaClonada); // Añadir tabla clonada

// //             // Mostrar el modal
// //             const modal = new bootstrap.Modal(document.getElementById("modalTabla"));
// //             modal.show();
// //         }, { once: true }); // Se asegura de que el evento se asigne solo una vez
// //     });
// // }
// // document.getElementById("modalTabla").addEventListener("hidden.bs.modal", () => {
// //     // Forzar la eliminación del backdrop
// //     const backdrop = document.querySelector(".modal-backdrop");
// //     if (backdrop) backdrop.remove();
// //     document.body.classList.remove("modal-open"); // Elimina la clase que impide el scroll
// //     document.body.style.overflow = ""; // Restablece el scroll
// // });
   

// function limpiarBackdrops() {
//     const backdrops = document.querySelectorAll(".modal-backdrop");
//     backdrops.forEach((backdrop) => backdrop.remove());
// }

// function mostrarModal() {
//     const botonesVisualizar = document.querySelectorAll(".btn-secondary");

//     botonesVisualizar.forEach((boton, index) => {
//         boton.addEventListener("click", () => {
//             // Seleccionar la tabla correspondiente
//             const tablaOriginal = document.querySelectorAll(".tabla-barrio table")[index];
//             const filasOriginales = tablaOriginal.querySelectorAll("tbody tr");

//             // Crear una nueva tabla para el modal
//             const nuevaTabla = document.createElement("table");
//             nuevaTabla.classList.add("table");
            
//             const nombreBarrio = boton.closest('.tabla-barrio').querySelector('h3').textContent;

//             // Cambiar el título del modal con el nombre del barrio
//             const modalTitle = document.getElementById("modalTablaLabel");
//             modalTitle.textContent = `${nombreBarrio}`;

//             // Crear encabezado
//             const thead = document.createElement("thead");
//             thead.innerHTML = `
//                 <tr>
//                     <th>Cliente</th>
//                     <th>Dirección</th>
//                 </tr>`;
//             nuevaTabla.appendChild(thead);

//             // Crear cuerpo de la tabla
//             const tbody = document.createElement("tbody");
//             filasOriginales.forEach((filaOriginal) => {
//                 const nuevaFila = document.createElement("tr");
//                 nuevaFila.innerHTML = filaOriginal.innerHTML; // Copiar el contenido de las celdas
//                 tbody.appendChild(nuevaFila);
//             });
//             nuevaTabla.appendChild(tbody);

//             // Insertar la nueva tabla en el modal
//             const contenedorTablaCompleta = document.getElementById("contenedorTablaCompleta");
//             contenedorTablaCompleta.innerHTML = ""; // Limpiar contenido previo
//             contenedorTablaCompleta.appendChild(nuevaTabla);

//             // Mostrar el modal
//             const modal = new bootstrap.Modal(document.getElementById("modalTabla"));
//             modal.show();

//             // Limpiar backdrops al mostrar
//             limpiarBackdrops();
//         });
//     });

//     // Limpiar backdrops al cerrar el modal
//     const modalElemento = document.getElementById("modalTabla");
//     modalElemento.addEventListener("hidden.bs.modal", limpiarBackdrops);
// }
async function cargarBarrios() {
    const contenedorGrilla = document.querySelector('.contenedor-grilla');
    contenedorGrilla.innerHTML = ''; // Limpiar la grilla antes de cargar nuevos barrios

    try {
        const response = await fetch('http://localhost:3000/barrios');
        if (!response.ok) throw new Error('Error al obtener los barrios');
        const barrios = await response.json();

        barrios.forEach(barrio => {
            const tablaBarrio = document.createElement('div');
            tablaBarrio.classList.add('tabla-barrio');
            tablaBarrio.innerHTML = `
                <div class="header-contenedor">
                    <h3>${barrio.barrio}</h3>
                    <button class="btn btn-secondary btn-sm" onclick="mostrarClientes(${barrio.id}, '${barrio.barrio}')">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
                <p>Cantidad de clientes: ${barrio.cantidadClientes}</p>
            `;
            contenedorGrilla.appendChild(tablaBarrio);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
document.addEventListener('DOMContentLoaded', cargarBarrios);

async function mostrarClientes(barrioId, barrioNombre) {
    const modalLabel = document.getElementById('modalTablaLabel');
    const contenedorTabla = document.getElementById('contenedorTablaCompleta');

    try {
        // Obtener los clientes del barrio
        const response = await fetch(`http://localhost:3000/clientes/idbarrio/${barrioId}`);
        if (!response.ok) throw new Error('Error al obtener los clientes');
        const clientes = await response.json();

        modalLabel.textContent = `Clientes de ${barrioNombre}`;
        contenedorTabla.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr><th>Cliente</th><th>Dirección</th></tr>
                </thead>
                <tbody>
                    ${clientes.map(cliente => `<tr><td>${cliente.nombre} ${cliente.apellido}</td><td>${cliente.direccion}</td></tr>`).join('')}
                </tbody>
            </table>
        `;

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('modalTabla'));
        modal.show();
    } catch (error) {
        console.error('Error:', error);
    }
}
document.getElementById('agregarBarrio').addEventListener('click', () => {
    const inputContainer = document.getElementById('inputContainer');

    // Si ya hay un input, no creamos otro
    if (!inputContainer.querySelector('input')) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'nombreBarrio';
        input.placeholder = 'Nombre del barrio';
        inputContainer.appendChild(input);

        // Crear botón para enviar
        const submitButton = document.createElement('button');
        submitButton.innerText = 'Agregar';
        submitButton.classList.add('btn', 'btn-secondary', 'botonAgregar');
        inputContainer.appendChild(submitButton);

        submitButton.addEventListener('click', () => {
            const nombreBarrio = document.getElementById('nombreBarrio').value;

            if (nombreBarrio) {
                fetch('http://localhost:3000/barrios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre: nombreBarrio })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.barrioId) {
                        alert('Barrio agregado exitosamente');
                        input.value = '';  // Limpiar el campo
                        inputContainer.innerHTML = ''; 
                        cargarBarrios();

                    } else {
                        alert('Error al agregar barrio: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error al hacer la solicitud:', error);
                    alert('Hubo un error al agregar el barrio');
                });
            } else {
                alert('Debe ingresar un nombre para el barrio');
            }
        });
    }
});