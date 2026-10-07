const depositForm = document.getElementById("depositForm");
const depositAmount = document.getElementById("depositAmount");
const amountButtons = document.querySelectorAll(".amount-btn");

amountButtons.forEach(function(button) {

    button.addEventListener("click", function() {
        depositAmount.value = button.dataset.amount;
    });

});

depositForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const amount = parseFloat(depositAmount.value);

    if (amount <= 0 || isNaN(amount)) {

        swal({
            title: "Monto no válido",
            text: "Ingresa un monto mayor a $0.00.",
            icon: "warning",
            button: "Aceptar"
        });

        return;
    }

    const saldoActual = obtenerSaldo();
    const nuevoSaldo = saldoActual + amount;

    guardarSaldo(nuevoSaldo);

    registrarTransaccion(
        "Depósito",
        "Depósito en cuenta",
        amount
    );

    swal({
        title: "¡Depósito realizado!",
        text: "Monto depositado: $" + amount.toFixed(2) +
              "\nNuevo saldo: $" + nuevoSaldo.toFixed(2),
        icon: "success",
        button: "Aceptar"
    }).then(() => {

        window.location.href = "menu.html";

    });

});