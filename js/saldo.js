const currentBalance = document.getElementById("currentBalance");

const saldoActual = obtenerSaldo();

currentBalance.textContent =
    "$" + saldoActual.toFixed(2);