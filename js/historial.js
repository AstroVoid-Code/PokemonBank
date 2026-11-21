
// ==========================================
// POKÉMON BANK - FASE 2
// HISTORIAL DE TRANSACCIONES
// ==========================================

// Verificar sesión activa
if (sessionStorage.getItem("sesionPokemonBank") !== "activa") {

    window.location.replace("index.html");

} else {

    const historyBody =
        document.getElementById("historyBody");

    const emptyHistory =
        document.getElementById("emptyHistory");

    // Obtener transacciones desde LocalStorage
    const historial = obtenerHistorial();

    // ==========================================
    // MOSTRAR HISTORIAL
    // ==========================================

    if (historial.length === 0) {

        emptyHistory.style.display = "block";

    } else {

        emptyHistory.style.display = "none";

        historial.forEach(function(transaccion) {

            // Crear fila
            const row = document.createElement("tr");

            // Determinar si suma o resta dinero
            const monto = Number(transaccion.monto);
            const esPositivo = monto > 0;

            // Signo del movimiento
            const signo = esPositivo ? "+" : "-";

            // Clase CSS según el movimiento
            const claseMonto = esPositivo
                ? "amount-positive"
                : "amount-negative";

            // Crear celdas de manera segura
            function agregarCelda(texto, clase = "") {

                const celda = document.createElement("td");
                celda.textContent = texto;

                if (clase) {
                    celda.className = clase;
                }

                row.appendChild(celda);
            }

            // Fecha
            agregarCelda(transaccion.fecha || "Sin fecha");

            // Hora
            agregarCelda(transaccion.hora || "Sin hora");

            // Tipo de transacción
            agregarCelda(
                transaccion.tipo || "Sin tipo",
                "transaction-type"
            );

            // Detalle: incluye número de factura
            // cuando corresponde a un pago de servicios
            agregarCelda(
                transaccion.detalle || "Sin detalle"
            );

            // Monto
            agregarCelda(
                Number.isFinite(monto)
                    ? signo + "$" + Math.abs(monto).toFixed(2)
                    : "Monto no disponible",
                Number.isFinite(monto) ? claseMonto : ""
            );

            // Agregar fila a la tabla
            historyBody.appendChild(row);

        });

    }

}