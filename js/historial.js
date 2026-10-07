const historyBody =
    document.getElementById("historyBody");

const emptyHistory =
    document.getElementById("emptyHistory");

const historial =
    obtenerHistorial();


// Si no existen transacciones
if (historial.length === 0) {

    emptyHistory.style.display = "block";

} else {

    historial.forEach(function(transaccion) {

        // Crear fila
        const row =
            document.createElement("tr");


        // Determinar si suma o resta dinero
        const esPositivo =
            transaccion.monto > 0;


        // Signo del monto
        const signo =
            esPositivo ? "+" : "-";


        // Clase según el tipo de movimiento
        const claseMonto =
            esPositivo
                ? "amount-positive"
                : "amount-negative";


        // Crear contenido
        row.innerHTML = `

            <td>
                ${transaccion.fecha}
            </td>

            <td>
                ${transaccion.hora}
            </td>

            <td class="transaction-type">
                ${transaccion.tipo}
            </td>

            <td>
                ${transaccion.detalle}
            </td>

            <td class="${claseMonto}">
                ${signo}$${Math.abs(transaccion.monto).toFixed(2)}
            </td>

        `;


        // Agregar fila a la tabla
        historyBody.appendChild(row);

    });

}