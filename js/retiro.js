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
        alert("Ingresa un monto válido.");
        return;
    }

    if (amount > saldoActual) {

        alert(
            "Saldo insuficiente.\n\n" +
            "Saldo disponible: $" + saldoActual.toFixed(2)
        );

        return;
    }

    const nuevoSaldo = saldoActual - amount;

    guardarSaldo(nuevoSaldo);
    registrarTransaccion(
    "Retiro",
    "Retiro de efectivo",
    -amount
);

    alert(
        "Retiro realizado correctamente.\n\n" +
        "Monto retirado: $" + amount.toFixed(2) +
        "\nNuevo saldo: $" + nuevoSaldo.toFixed(2)
    );

    window.location.href = "menu.html";

});