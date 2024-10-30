document.addEventListener("DOMContentLoaded", function () {
    // Datos de ejemplo
    const semanaData = [
        { producto: "Cajón de Sodas (x6)", cantidad: 20, precio: 2000 },
        { producto: "Soda Unidad", cantidad: 50, precio: 400 },
        { producto: "Garrafa de Gas", cantidad: 10, precio: 10000 },
        { producto: "Dispenser", cantidad: 8, precio: 7000 },
        { producto: "Bidón de Agua", cantidad: 30, precio: 2000 },
        { producto: "Pack 1: 2 Cajones de Sodas + Garrafa de Gas", cantidad: 5, precio: 12500 },
        { producto: "Pack 2: 4 Sodas Unidad + Garrafa de Gas", cantidad: 7, precio: 10500 },
        { producto: "Pack 3: 2 Bidones de Agua + 2 Dispensers", cantidad: 3, precio: 16500 }
    ];

    const mesData = [
        { producto: "Cajón de Sodas (x6)", cantidad: 120, precio: 2000 },
        { producto: "Soda Unidad", cantidad: 40, precio: 400 },
        { producto: "Garrafa de Gas", cantidad: 23, precio: 10000 },
        { producto: "Dispenser", cantidad: 12, precio: 7000 },
        { producto: "Bidón de Agua", cantidad: 50, precio: 2000 },
        { producto: "Pack 1: 2 Cajones de Sodas + Garrafa de Gas", cantidad: 15, precio: 12500 },
        { producto: "Pack 2: 4 Sodas Unidad + Garrafa de Gas", cantidad: 6, precio: 10500 },
        { producto: "Pack 3: 2 Bidones de Agua + 2 Dispensers", cantidad: 9, precio: 16500 }
    ];

    function renderTable(data, tableId, totalId) {
        const tableBody = document.getElementById(tableId);
        tableBody.innerHTML = "";
        let total = 0;

        data.forEach(item => {
            const row = document.createElement("tr");
            const totalItem = item.cantidad * item.precio;
            total += totalItem;

            row.innerHTML = `
                <td>${item.producto}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio.toLocaleString()}</td>
                <td>$${totalItem.toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });

        document.getElementById(totalId).textContent = `$${total.toLocaleString()}`;
    }

    // Inicializar con datos semanales
    renderTable(semanaData, "semana-data", "semana-total");
    renderTable(mesData, "mes-data", "mes-total");

    // Configuración del gráfico de ventas
    const ctx = document.getElementById("salesChart").getContext("2d");
    let salesChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: semanaData.map(item => item.producto),
            datasets: [{
                label: "Ventas Semanales",
                data: semanaData.map(item => item.cantidad * item.precio),
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(255, 99, 132, 0.6)"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Función para actualizar el gráfico y los datos
    function actualizarGrafico(data, label) {
        salesChart.data.labels = data.map(item => item.producto);
        salesChart.data.datasets[0].data = data.map(item => item.cantidad * item.precio);
        salesChart.data.datasets[0].label = label;
        salesChart.update();
    }

    // Configuración de los botones
    document.getElementById("btn-semanal").addEventListener("click", function () {
        renderTable(semanaData, "semana-data", "semana-total");
        actualizarGrafico(semanaData, "Ventas Semanales");
    });

    document.getElementById("btn-mensual").addEventListener("click", function () {
        renderTable(mesData, "mes-data", "mes-total");
        actualizarGrafico(mesData, "Ventas Mensuales");
    });

    // Inicializar con gráfico semanal por defecto
    actualizarGrafico(semanaData, "Ventas Semanales");
});
