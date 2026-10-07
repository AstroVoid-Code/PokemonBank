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

        swal({
            title: "Selecciona un servicio",
            text: "Debes elegir el servicio que deseas pagar.",
            icon: "warning",
            button: "Aceptar"
        });

        return;
    }


    // Validar factura
    if (factura === "") {

        swal({
            title: "Factura requerida",
            text: "Ingresa el número de factura.",
            icon: "warning",
            button: "Aceptar"
        });

        return;
    }


    // Validar monto
    if (isNaN(monto) || monto <= 0) {

        swal({
            title: "Monto no válido",
            text: "Ingresa un monto mayor a $0.00.",
            icon: "warning",
            button: "Aceptar"
        });

        return;
    }


    // Verificar saldo
    if (monto > saldoActual) {

        swal({
            title: "Saldo insuficiente",
            text: "Tu saldo disponible es de $" +
                  saldoActual.toFixed(2),
            icon: "error",
            button: "Aceptar"
        });

        return;
    }


    // Calcular nuevo saldo
    const nuevoSaldo = saldoActual - monto;


    // Guardar saldo
    guardarSaldo(nuevoSaldo);

    registrarTransaccion(
        "Servicio",
        servicio,
        -monto
    );


    // Confirmación
    swal({
        title: "¡Pago realizado!",
        text: "Servicio: " + servicio +
              "\nFactura: " + factura +
              "\nMonto pagado: $" + monto.toFixed(2) +
              "\nNuevo saldo: $" + nuevoSaldo.toFixed(2),
        icon: "success",
        button: "Aceptar"
    }).then(() => {

        // Regresar al menú
        window.location.href = "menu.html";

    });

});