document.addEventListener('DOMContentLoaded', () => {
    const clientes = [
        { nombre: 'Juan', apellido: 'Pérez', telefono: '123456789', direccion: 'Calle Falsa 123' },
        { nombre: 'María', apellido: 'Gómez', telefono: '987654321', direccion: 'Avenida Siempreviva 742' },
        { nombre: 'Carlos', apellido: 'López', telefono: '123123123', direccion: 'Pasaje Los Andes 456' },
        { nombre: 'Laura', apellido: 'Fernández', telefono: '321321321', direccion: 'Barrio Las Flores' },
        { nombre: 'Fernando', apellido: 'Castro', telefono: '456456456', direccion: 'Ruta 40 Km 123' },
        { nombre: 'Ana', apellido: 'Martínez', telefono: '789789789', direccion: 'Calle Mayor 89' },
        { nombre: 'Pedro', apellido: 'Ruiz', telefono: '654654654', direccion: 'Calle Nueva 22' },
        { nombre: 'Lucía', apellido: 'Herrera', telefono: '1122334455', direccion: 'Plaza Norte 100' },
        { nombre: 'Miguel', apellido: 'Álvarez', telefono: '9988776655', direccion: 'Alameda Sur 250' },
        { nombre: 'Roberto', apellido: 'Díaz', telefono: '3344556677', direccion: 'Av. Libertador 345' },
        { nombre: 'Sofía', apellido: 'Morales', telefono: '2233445566', direccion: 'Calle Vieja 567' },
        { nombre: 'Jorge', apellido: 'Ramírez', telefono: '7788990011', direccion: 'Ruta 8 Km 200' },
        { nombre: 'Valeria', apellido: 'Sánchez', telefono: '5544332211', direccion: 'Barrio Nuevo 45' },
        { nombre: 'Federico', apellido: 'Ortega', telefono: '6677889900', direccion: 'Av. Rivadavia 789' },
        { nombre: 'Carolina', apellido: 'Navarro', telefono: '4455667788', direccion: 'Pasaje Olmos 12' },
        { nombre: 'Guillermo', apellido: 'Mendoza', telefono: '3344221133', direccion: 'Calle Belgrano 67' },
        { nombre: 'Paula', apellido: 'Cabrera', telefono: '9900112233', direccion: 'Avenida 9 de Julio 200' },
        { nombre: 'Ricardo', apellido: 'Molina', telefono: '1122003300', direccion: 'Calle Mitre 156' }
    ];

    const inputClienteSeleccionado = document.getElementById('clientesSeleccionados');
    const tablaClientes = document.getElementById('tablaClientes');
    const filtroCliente = document.getElementById('filtroCliente');

    // Cargar clientes en la tabla
    function cargarClientes(clientesFiltrados) {
        tablaClientes.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos clientes

        clientesFiltrados.forEach((cliente, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td><button class="btn btn-primary" onclick="seleccionarCliente(${index})">Seleccionar</button></td>
            `;
            tablaClientes.appendChild(fila);
        });
    }

    // Inicializar tabla con todos los clientes
    cargarClientes(clientes);

    // Filtrar clientes
    filtroCliente.addEventListener('input', () => {
        const valor = filtroCliente.value.toLowerCase();
        const clientesFiltrados = clientes.filter(cliente => 
            cliente.nombre.toLowerCase().includes(valor) || cliente.apellido.toLowerCase().includes(valor)
        );
        cargarClientes(clientesFiltrados);
    });

    // Ordenar clientes ascendente/descendente
    window.ordenarClientes = function(orden) {
        const clientesOrdenados = [...clientes].sort((a, b) => {
            const nombreCompletoA = `${a.nombre} ${a.apellido}`.toLowerCase();
            const nombreCompletoB = `${b.nombre} ${b.apellido}`.toLowerCase();

            if (orden === 'asc') {
                return nombreCompletoA.localeCompare(nombreCompletoB);
            } else {
                return nombreCompletoB.localeCompare(nombreCompletoA);
            }
        });
        cargarClientes(clientesOrdenados);
    };

    // Seleccionar cliente
    window.seleccionarCliente = function(index) {
        const clienteSeleccionado = clientes[index];
        inputClienteSeleccionado.value = `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`;
        const modal = bootstrap.Modal.getInstance(document.getElementById('clientesModal'));
        modal.hide();
    };
});
