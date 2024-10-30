async function openModifyModal(id_producto) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id_producto}`);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const producto = await response.json();
        if (producto) {
            document.getElementById("productId").value = producto.id_producto;
            document.getElementById("productName").value = producto.nombre;
            document.getElementById("productPrice").value = producto.precio;
            document.getElementById("productDescription").value = producto.descripcion; // Cargar descripción


            new bootstrap.Modal(document.getElementById("modifyProductModal")).show();
        } else console.error('Producto no encontrado');
    } catch (error) {
        console.error('Error al abrir el modal de modificación:', error);
    }
}
async function guardarCambios() {
    const id_producto = document.getElementById("productId").value;
    const nombre = document.getElementById("productName").value;
    const precio = parseFloat(document.getElementById("productPrice").value);
    const descripcion = document.getElementById("productDescription").value; // Obtener la descripción

    

    const productoActualizado = {
        nombre,
        descripcion,
        precio
    };

    const confirm = window.confirm("¿Desea modificar este producto?");

    if (confirm) { // Si el usuario confirma, procede a actualizar
        try {
            const response = await fetch(`http://localhost:3000/productos/${id_producto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productoActualizado),
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el producto: ${response.status}`);
            }

            const result = await response.json();
            console.log('Producto actualizado:', result);
            
            // Cierra el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById("modifyProductModal"));
            modal.hide();

            // Recargar la lista de productos
            cargarProductos();

        } catch (error) {
            console.error('Error al guardar cambios:', error);
        }
    } else {
        console.log('Modificación cancelada por el usuario.');
    }
}

async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:3000/productos');
        const productos = await response.json();
        const productTableBody = document.getElementById('productTableBody');
        productTableBody.innerHTML = ''; // Limpiar tabla

        productos.forEach(({ id_producto, nombre, precio, estado }) => {
            const row = document.createElement('tr');
            const rowColor = estado === 0 ? '#d3d3d3' : ''; // Color gris para productos desactivados

            row.innerHTML = `
                <td style="background-color: ${rowColor};">${id_producto}</td>
                <td style="background-color: ${rowColor};">${nombre}</td>
                <td style="background-color: ${rowColor};"><button class="btn btn-circular btn-lg" onclick="mostrarDescripcionProducto(${id_producto})">
                        <i class="fa-solid fa-circle-info"></i>
                    </button></td>
                <td style="background-color: ${rowColor};">$${precio.toLocaleString()}</td>
                <td style="background-color: ${rowColor};">
                    <button class="btn btn-outline-primary" onclick="openModifyModal(${id_producto})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="btn btn-outline-danger" onclick="desactivarProducto(${id_producto})" ${estado === 0 ? 'disabled' : ''}>
                        <i class="fa-solid fa-x"></i>
                    </button>

                    <button class="btn btn-outline-success" onclick="activarProducto(${id_producto})" ${estado === 1 ? 'disabled' : ''}>
                        <i class="fa-solid fa-check"></i>
                    </button>

                    <button class="btn btn-danger" onclick="deleteProduct(${id_producto})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    
   
});
function agregarProducto() {
    // Limpia los campos del modal
    document.getElementById("newProductName").value = '';
    document.getElementById("newProductPrice").value = '';
    document.getElementById("newProductDescription").value = ''; // Asegúrate de tener este campo en tu modal

    // Muestra el modal
    const modal = new bootstrap.Modal(document.getElementById("addProductModal"));
    modal.show();

    // Agrega el evento al botón "Agregar Producto"
    document.getElementById("addNewProduct").onclick = async () => {
        const nombre = document.getElementById("newProductName").value;
        const precio = parseFloat(document.getElementById("newProductPrice").value);
        const descripcion = document.getElementById("newProductDescription").value;

        const nuevoProducto = {
            nombre,
            descripcion,
            precio
        };

        // Mostrar alerta de confirmación
        const confirm = window.confirm("¿Desea agregar este producto?");

        if (confirm) { // Si el usuario confirma, procede a agregar el producto
            try {
                const response = await fetch(`http://localhost:3000/productos`, {
                    method: 'POST', // Método para agregar un nuevo producto
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(nuevoProducto),
                });

                if (!response.ok) {
                    throw new Error(`Error al agregar el producto: ${response.status}`);
                }

                const result = await response.json();
                console.log('Producto agregado:', result);
                alert('✅Producto agregado con éxito')
                // Cierra el modal
                modal.hide();
                
                // Recargar la lista de productos
                cargarProductos();

            } catch (error) {
                console.error('Error al agregar producto:', error);
            }
        } else {
            console.log('Adición cancelada por el usuario.');
        }
    };
}
async function mostrarDescripcionProducto(id_producto) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id_producto}`);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const producto = await response.json();
        if (producto) {
            document.getElementById("productDescriptionText").innerText = producto.descripcion;

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("productDescriptionModal"));
            modal.show();
        } else {
            console.error('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al abrir el modal de descripción:', error);
    }
}

document.getElementById("buscarProducto").addEventListener("keyup", function() {

    const filter = this.value.toLowerCase();
    const tableBody = document.getElementById("productTableBody");
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

  function desactivarProducto(id_producto) {
    // Muestra la alerta de confirmación
    const confirmDesactivar = window.confirm("¿Estás seguro de que quieres desactivar este producto?");
    
    if (confirmDesactivar) {
        // Si el usuario confirma, realiza la solicitud
        fetch(`http://localhost:3000/productos/${id_producto}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: 0 }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al desactivar el producto: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            cargarProductos();
            alert("✅PRODUCTO DESACTIVADO EXITOSAMENTE");
        })
        .catch(error => {
            // Muestra un mensaje de error
            alert('Error al desactivar producto: ' + error.message);
        });
    } else {
        // Si el usuario cancela
        alert('Desactivación cancelada');
    }
}
function activarProducto(id_producto) {
    // Muestra la alerta de confirmación
    const confirmDesactivar = window.confirm("¿Estás seguro de que quieres activar este producto?");
    
    if (confirmDesactivar) {
        // Si el usuario confirma, realiza la solicitud
        fetch(`http://localhost:3000/productos/${id_producto}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: 1}) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al activar el producto: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            cargarProductos();
            alert("✅CLIENTE ACTIVADO EXITOSAMENTE");
        })
        .catch(error => {
        
            alert('Error al activar producto: ' + error.message);
        });
    } else {
    
        alert('❌Activación cancelada');
    }
}

function deleteProduct(id_producto) {

    const confirmDelete = window.confirm("🛑⚠️¿Estás seguro de que quieres eliminar este producto? Esta acción es irreversible.⚠️🛑");

    if (confirmDelete) {
       
        fetch(`http://localhost:3000/productos/${id_producto}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al eliminar el producto: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            cargarProductos(); 
        })
        .catch(error => {
            alert('Error al eliminar producto: ' + error.message);
        });
    } else {
        alert('Eliminación cancelada');
    }
}
