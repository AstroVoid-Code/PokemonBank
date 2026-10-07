const serviceForm = document.getElementById("serviceForm");

const serviceType = document.getElementById("serviceType");
const invoiceNumber = document.getElementById("invoiceNumber");
const serviceAmount = document.getElementById("serviceAmount");

const availableBalance = document.getElementById("availableBalance");


// Mostrar saldo actual
function mostrarSaldoDisponible() {

    const saldoActual = obtenerSaldo();

    availableBalance.textContent =
        "$" + saldoActual.toFixed(2);
}

mostrarSaldoDisponible();


// Procesar pago
serviceForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const servicio = serviceType.value;
    const factura = invoiceNumber.value.trim();
    const monto = parseFloat(serviceAmount.value);

    const saldoActual = obtenerSaldo();


    // Validar servicio
    if (servicio === "") {

        alert("Selecciona un servicio.");
        return;

    }


    // Validar factura
    if (factura === "") {

        alert("Ingresa el número de factura.");
        return;

    }


    // Validar monto
    if (isNaN(monto) || monto <= 0) {

        alert("Ingresa un monto válido.");
        return;

    }


    // Verificar saldo
    if (monto > saldoActual) {

        alert(
            "Saldo insuficiente.\n\n" +
            "Saldo disponible: $" +
            saldoActual.toFixed(2)
        );

        return;

    }


    // Calcular nuevo saldo
    const nuevoSaldo =
        saldoActual - monto;


    // Guardar saldo
    guardarSaldo(nuevoSaldo);
    registrarTransaccion(
    "Servicio",
    servicio,
    -monto
);


    // Confirmación
    alert(
        "Pago realizado correctamente.\n\n" +
        "Servicio: " + servicio +
        "\nFactura: " + factura +
        "\nMonto pagado: $" + monto.toFixed(2) +
        "\nNuevo saldo: $" + nuevoSaldo.toFixed(2)
    );


    // Regresar al menú
    window.location.href = "menu.html";

});