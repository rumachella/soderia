function confirmarCerrarSesion(event) {
  event.preventDefault();
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      window.location.href = "index.html";
  }
}

  /*GRAFICO*/
  document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
        type: 'doughnut', // Tipo de gráfico, puede ser 'pie', 'bar', 'line', etc.
        data: {
            labels: ['Producto A', 'Producto B', 'Producto C', 'Producto D'],
            datasets: [{
                label: 'Ventas por Producto',
                data: [3000, 5000, 2000, 1000], // Datos de ejemplo
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: $${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mobileNav = document.getElementById('mobile-nav');
    
    sidebarToggle.addEventListener('click', function () {
        if (sidebar.classList.contains('d-none')) {
            sidebar.classList.remove('d-none');
            mobileNav.classList.add('d-none');
        } else {
            sidebar.classList.add('d-none');
            mobileNav.classList.remove('d-none');
        }
    });
});
