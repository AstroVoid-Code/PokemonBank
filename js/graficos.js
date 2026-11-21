
// ==========================================
// GRÁFICOS DE TRANSACCIONES - POKÉMON BANK
// ==========================================

// Obtener historial almacenado en LocalStorage
const historial = obtenerHistorial();

// Inicializar contadores
let depositos = 0;
let retiros = 0;
let servicios = 0;

// Contar las transacciones registradas
historial.forEach(function(transaccion) {

    switch (transaccion.tipo) {

        case "Depósito":
            depositos++;
            break;

        case "Retiro":
            retiros++;
            break;

        case "Servicio":
            servicios++;
            break;

    }

});

// Mostrar totales en las tarjetas
document.getElementById("totalDepositos").textContent =
    depositos;

document.getElementById("totalRetiros").textContent =
    retiros;

document.getElementById("totalServicios").textContent =
    servicios;

// Obtener elemento del gráfico
const canvas = document.getElementById("transactionChart");

// Verificar que exista el gráfico y Chart.js
if (canvas && typeof Chart !== "undefined") {

    new Chart(canvas, {

        type: "bar",

        data: {

            labels: [
                "Depósitos",
                "Retiros",
                "Servicios"
            ],

            datasets: [{

                label: "Cantidad de transacciones",

                data: [
                    depositos,
                    retiros,
                    servicios
                ],

                backgroundColor: [
                    "#198754",
                    "#dc3545",
                    "#19376d"
                ],

                borderWidth: 0,

                borderRadius: 6

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        stepSize: 1,
                        precision: 0
                    }

                }

            }

        }

    });

}