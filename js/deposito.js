
 // ==========================================
 // POKÉMON BANK - FASE 2
 // OPERACIÓN DE DEPÓSITO
 // ==========================================

if (verificarSesion()) {

    const depositForm = document.getElementById("depositForm");
    const depositAmount = document.getElementById("depositAmount");
    const amountButtons = document.querySelectorAll(".amount-btn");

    // ==========================================
    // MONTOS RÁPIDOS
    // ==========================================

    amountButtons.forEach(function(button) {

        button.addEventListener("click", function() {
            depositAmount.value = button.dataset.amount;
        });

    });

    // ==========================================
    // PROCESAR DEPÓSITO
    // ==========================================

    depositForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const amount = Number(depositAmount.value);

        // Validar monto y máximo dos decimales
        if (
            !Number.isFinite(amount) ||
            amount <= 0 ||
            !Number.isSafeInteger(Math.round(amount * 100)) ||
            Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001
        ) {

            swal({
                title: "Monto no válido",
                text: "Ingresa un monto mayor a $0.00, con máximo dos decimales.",
                icon: "warning",
                button: "Aceptar"
            });

            return;
        }

        // Obtener saldo actual
        const saldoActual = obtenerSaldo();

        if (!Number.isFinite(saldoActual)) {

            swal({
                title: "Error de saldo",
                text: "No se pudo obtener el saldo de la cuenta.",
                icon: "error",
                button: "Aceptar"
            });

            return;
        }

        // Calcular nuevo saldo
        const nuevoSaldo = Math.round(
            (saldoActual + amount) * 100
        ) / 100;

        // Verificar que el resultado sea válido
        if (!Number.isFinite(nuevoSaldo)) {

            swal({
                title: "Error de operación",
                text: "No se pudo calcular el nuevo saldo.",
                icon: "error",
                button: "Aceptar"
            });

            return;
        }

        // Guardar nuevo saldo
        guardarSaldo(nuevoSaldo);

        // Registrar transacción y conservar sus datos
        const transaccion = registrarTransaccion(
            "Depósito",
            "Depósito en cuenta",
            amount
        );

        // ==========================================
        // CONFIRMACIÓN Y COMPROBANTE PDF
        // ==========================================

        swal({
            title: "¡Depósito realizado!",
            text: "Monto depositado: $" + amount.toFixed(2) +
                  "\nNuevo saldo: $" + nuevoSaldo.toFixed(2) +
                  "\n\n¿Deseas descargar tu comprobante PDF?",
            icon: "success",
            buttons: {
                cancelar: {
                    text: "No, gracias",
                    value: false,
                    visible: true
                },
                descargar: {
                    text: "Descargar PDF",
                    value: true
                }
            }
        }).then(function(descargar) {

            if (descargar) {

                // Comprobar que jsPDF esté disponible
                if (
                    !window.jspdf ||
                    !window.jspdf.jsPDF
                ) {

                    swal({
                        title: "PDF no disponible",
                        text: "No se cargó la biblioteca jsPDF. El depósito sí fue registrado.",
                        icon: "error",
                        button: "Aceptar"
                    }).then(function() {
                        window.location.href = "menu.html";
                    });

                    return;
                }

                // Crear documento PDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF();

                const usuario = obtenerUsuario();

                // Encabezado
                pdf.setFontSize(20);
                pdf.setTextColor(25, 55, 105);
                pdf.text("POKEMON BANK", 105, 25, {
                    align: "center"
                });

                pdf.setFontSize(10);
                pdf.setTextColor(90, 90, 90);
                pdf.text(
                    "Tu dinero, siempre a salvo.",
                    105,
                    33,
                    { align: "center" }
                );

                pdf.setDrawColor(25, 55, 105);
                pdf.line(20, 40, 190, 40);

                // Título
                pdf.setFontSize(15);
                pdf.setTextColor(0, 0, 0);
                pdf.text(
                    "COMPROBANTE DE DEPOSITO",
                    105,
                    52,
                    { align: "center" }
                );

                // Datos de la operación
                pdf.setFontSize(11);

                pdf.text("Cliente:", 25, 70);
                pdf.text(usuario.nombre, 85, 70);

                pdf.text("Numero de cuenta:", 25, 80);
                pdf.text(usuario.cuenta, 85, 80);

                pdf.text("Numero de operacion:", 25, 90);
                pdf.text(transaccion.id, 85, 90);

                pdf.text("Fecha:", 25, 100);
                pdf.text(transaccion.fecha, 85, 100);

                pdf.text("Hora:", 25, 110);
                pdf.text(transaccion.hora, 85, 110);

                pdf.text("Tipo de transaccion:", 25, 120);
                pdf.text(transaccion.tipo, 85, 120);

                pdf.text("Monto depositado:", 25, 135);
                pdf.text(
                    "$" + amount.toFixed(2),
                    85,
                    135
                );

                pdf.text("Saldo anterior:", 25, 145);
                pdf.text(
                    "$" + saldoActual.toFixed(2),
                    85,
                    145
                );

                pdf.text("Nuevo saldo:", 25, 155);
                pdf.text(
                    "$" + nuevoSaldo.toFixed(2),
                    85,
                    155
                );

                pdf.line(20, 170, 190, 170);

                pdf.setFontSize(10);
                pdf.setTextColor(90, 90, 90);
                pdf.text(
                    "Transaccion realizada exitosamente.",
                    105,
                    182,
                    { align: "center" }
                );

                pdf.text(
                    "Gracias por utilizar Pokemon Bank.",
                    105,
                    190,
                    { align: "center" }
                );

                // Descargar comprobante
                pdf.save(
                    "PokemonBank_Deposito_" +
                    transaccion.id +
                    ".pdf"
                );

                window.location.href = "menu.html";

            } else {

                window.location.href = "menu.html";

            }

        });

    });

}