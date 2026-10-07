// Obtener historial guardado
const historial = obtenerHistorial();


// Contadores
let depositos = 0;
let retiros = 0;
let servicios = 0;


// Recorrer todas las transacciones
historial.forEach(function(transaccion) {

    if (transaccion.tipo === "Depósito") {

        depositos++;

    } else if (transaccion.tipo === "Retiro") {

        retiros++;

    } else if (transaccion.tipo === "Servicio") {

        servicios++;

    }

});


// Mostrar cantidades en las tarjetas
document.getElementById("totalDepositos").textContent =
    depositos;

document.getElementById("totalRetiros").textContent =
    retiros;

document.getElementById("totalServicios").textContent =
    servicios;


// Obtener canvas
const ctx =
    document.getElementById("transactionChart");


// Crear gráfico
new Chart(ctx, {

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