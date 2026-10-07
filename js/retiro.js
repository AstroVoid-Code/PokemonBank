const withdrawForm = document.getElementById("withdrawForm");
const withdrawAmount = document.getElementById("withdrawAmount");
const amountButtons = document.querySelectorAll(".amount-btn");

amountButtons.forEach(function(button) {

    button.addEventListener("click", function() {
        withdrawAmount.value = button.dataset.amount;
    });

});

withdrawForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const amount = parseFloat(withdrawAmount.value);
    const saldoActual = obtenerSaldo();

    if (amount <= 0 || isNaN(amount)) {
        swal({
            title: "Monto no válido",
            text: "Ingresa un monto mayor a $0.00.",
            icon: "warning",
            button: "Aceptar"
            });
             return;
        
    }

    if (amount > saldoActual) {

        swal({
            title: "Saldo insuficiente",
            text: "Tu saldo disponible es de $" + saldoActual.toFixed(2),
            icon: "error",
            button: "Aceptar"
        });

        return;
    }

    const nuevoSaldo = saldoActual - amount;

    guardarSaldo(nuevoSaldo);

    registrarTransaccion(
        "Retiro",
        "Retiro de efectivo",
        -amount
    );

    swal({
        title: "¡Retiro realizado!",
        text: "Monto retirado: $" + amount.toFixed(2) +
              "\nNuevo saldo: $" + nuevoSaldo.toFixed(2),
        icon: "success",
        button: "Aceptar"
    }).then(() => {
        window.location.href = "menu.html";
    });

});