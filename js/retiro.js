
// ==========================================
// POKÉMON BANK - FASE 2
// RETIRO DE EFECTIVO CON COMPROBANTE PDF
// ==========================================

// Verificar que exista una sesión activa
if (verificarSesion()) {

    const withdrawForm = document.getElementById("withdrawForm");
    const withdrawAmount = document.getElementById("withdrawAmount");
    const amountButtons = document.querySelectorAll(".amount-btn");

    // Evitar procesar dos veces el mismo retiro
    let retiroProcesado = false;

    // ==========================================
    // SELECCIONAR MONTOS RÁPIDOS
    // ==========================================

    amountButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            withdrawAmount.value = button.dataset.amount;

        });

    });

    // ==========================================
    // PROCESAR RETIRO
    // ==========================================

    withdrawForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (retiroProcesado) {
            return;
        }

        const montoTexto = withdrawAmount.value.trim();
        const amount = Number(montoTexto);
        const saldoActual = obtenerSaldo();

        // ==========================================
        // VALIDAR MONTO
        // ==========================================

        if (
            montoTexto === "" ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            !Number.isSafeInteger(Math.round(amount * 100)) ||
            Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001
        ) {

            swal({
                title: "Monto no válido",
                text: "Ingresa un monto mayor a $0.00 con máximo dos decimales.",
                icon: "warning",
                button: "Aceptar"
            });

            return;
        }

        // ==========================================
        // VALIDAR SALDO
        // ==========================================

        if (!Number.isFinite(saldoActual) || saldoActual < 0) {

            swal({
                title: "Error de saldo",
                text: "No se pudo obtener el saldo disponible.",
                icon: "error",
                button: "Aceptar"
            });

            return;
        }

        // ==========================================
        // VERIFICAR FONDOS SUFICIENTES
        // ==========================================

        if (amount > saldoActual) {

            swal({
                title: "Saldo insuficiente",
                text: "Tu saldo disponible es de $" +
                      saldoActual.toFixed(2),
                icon: "error",
                button: "Aceptar"
            });

            return;
        }

        // ==========================================
        // CALCULAR NUEVO SALDO
        // ==========================================

        const nuevoSaldo = Math.round(
            (saldoActual - amount) * 100
        ) / 100;

        if (!Number.isFinite(nuevoSaldo) || nuevoSaldo < 0) {

            swal({
                title: "Error de operación",
                text: "No se pudo calcular el nuevo saldo.",
                icon: "error",
                button: "Aceptar"
            });

            return;
        }

        // Bloquear nuevos envíos
        retiroProcesado = true;

        // Guardar saldo actualizado
        guardarSaldo(nuevoSaldo);

        // ==========================================
        // REGISTRAR TRANSACCIÓN
        // ==========================================

        const transaccion = registrarTransaccion(
            "Retiro",
            "Retiro de efectivo",
            -amount
        );

        // ==========================================
        // CONFIRMAR RETIRO Y OFRECER PDF
        // ==========================================

        swal({
            title: "¡Retiro realizado!",
            text: "Monto retirado: $" + amount.toFixed(2) +
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

            if (!descargar) {

                window.location.href = "menu.html";
                return;

            }

            // ==========================================
            // VERIFICAR BIBLIOTECA JSPDF
            // ==========================================

            if (!window.jspdf || !window.jspdf.jsPDF) {

                swal({
                    title: "PDF no disponible",
                    text: "No se cargó jsPDF. El retiro sí fue registrado.",
                    icon: "error",
                    button: "Aceptar"
                }).then(function() {

                    window.location.href = "menu.html";

                });

                return;
            }

            // ==========================================
            // GENERAR COMPROBANTE PDF
            // ==========================================

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            const usuario = obtenerUsuario();

            // ENCABEZADO
            pdf.setFontSize(20);
            pdf.setTextColor(25, 55, 105);

            pdf.text(
                "POKEMON BANK",
                105,
                25,
                { align: "center" }
            );

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

            // TÍTULO DEL COMPROBANTE
            pdf.setFontSize(15);
            pdf.setTextColor(0, 0, 0);

            pdf.text(
                "COMPROBANTE DE RETIRO",
                105,
                52,
                { align: "center" }
            );

            // DATOS DEL USUARIO
            pdf.setFontSize(11);

            pdf.text("Cliente:", 25, 70);
            pdf.text(usuario.nombre, 85, 70);

            pdf.text("Numero de cuenta:", 25, 80);
            pdf.text(usuario.cuenta, 85, 80);

            // DATOS DE LA TRANSACCIÓN
            pdf.text("Numero de operacion:", 25, 90);
            pdf.text(transaccion.id, 85, 90);

            pdf.text("Fecha:", 25, 100);
            pdf.text(transaccion.fecha, 85, 100);

            pdf.text("Hora:", 25, 110);
            pdf.text(transaccion.hora, 85, 110);

            pdf.text("Tipo de transaccion:", 25, 120);
            pdf.text("Retiro de efectivo", 85, 120);

            // DATOS FINANCIEROS
            pdf.text("Monto retirado:", 25, 135);
            pdf.text("$" + amount.toFixed(2), 85, 135);

            pdf.text("Saldo anterior:", 25, 145);
            pdf.text("$" + saldoActual.toFixed(2), 85, 145);

            pdf.text("Saldo restante:", 25, 155);
            pdf.text("$" + nuevoSaldo.toFixed(2), 85, 155);

            // PIE DEL COMPROBANTE
            pdf.setDrawColor(25, 55, 105);
            pdf.line(20, 170, 190, 170);

            pdf.setFontSize(10);
            pdf.setTextColor(90, 90, 90);

            pdf.text(
                "Retiro realizado exitosamente.",
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

            // ==========================================
            // DESCARGAR COMPROBANTE
            // ==========================================

            pdf.save(
                "PokemonBank_Retiro_" +
                transaccion.id +
                ".pdf"
            );

            // Regresar al menú principal
            window.location.href = "menu.html";

        });

    });

}