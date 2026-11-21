
 // ==========================================
 // POKÉMON BANK - FASE 2
 // PAGO DE SERVICIOS CON COMPROBANTE PDF
 // ==========================================

// Verificar que exista una sesión activa
if (verificarSesion()) {

    const serviceForm = document.getElementById("serviceForm");
    const serviceType = document.getElementById("serviceType");
    const invoiceNumber = document.getElementById("invoiceNumber");
    const serviceAmount = document.getElementById("serviceAmount");
    const availableBalance = document.getElementById("availableBalance");

    // ==========================================
    // MOSTRAR SALDO DISPONIBLE
    // ==========================================

    function mostrarSaldoDisponible() {

        const saldoActual = obtenerSaldo();

        if (Number.isFinite(saldoActual)) {

            availableBalance.textContent =
                "$" + saldoActual.toFixed(2);

        } else {

            availableBalance.textContent = "No disponible";

        }

    }

    mostrarSaldoDisponible();

    // ==========================================
    // PROCESAR PAGO DE SERVICIOS
    // ==========================================

    serviceForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const servicio = serviceType.value;
        const factura = invoiceNumber.value.trim();
        const montoTexto = serviceAmount.value.trim();
        const monto = Number(montoTexto);

        const saldoActual = obtenerSaldo();

        // ==========================================
        // VALIDAR SERVICIO
        // ==========================================

        if (servicio === "") {

            swal({
                title: "Selecciona un servicio",
                text: "Debes elegir el servicio que deseas pagar.",
                icon: "warning",
                button: "Aceptar"
            });

            return;
        }

        // ==========================================
        // VALIDAR NÚMERO DE FACTURA
        // ==========================================

        if (factura === "") {

            swal({
                title: "Factura requerida",
                text: "Ingresa el número de factura.",
                icon: "warning",
                button: "Aceptar"
            });

            return;
        }

        // ==========================================
        // VALIDAR MONTO
        // ==========================================

        if (
            montoTexto === "" ||
            !Number.isFinite(monto) ||
            monto <= 0 ||
            !Number.isSafeInteger(Math.round(monto * 100)) ||
            Math.abs(monto * 100 - Math.round(monto * 100)) > 0.000001
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

        // ==========================================
        // ACTUALIZAR SALDO
        // ==========================================

        const nuevoSaldo = Math.round(
            (saldoActual - monto) * 100
        ) / 100;

        guardarSaldo(nuevoSaldo);

        // ==========================================
        // REGISTRAR TRANSACCIÓN
        // ==========================================

        const transaccion = registrarTransaccion(
            "Servicio",
            servicio + " - Factura: " + factura,
            -monto
        );

        // ==========================================
        // CONFIRMAR PAGO Y OFRECER PDF
        // ==========================================

        swal({
            title: "¡Pago realizado!",
            text: "Servicio: " + servicio +
                  "\nFactura: " + factura +
                  "\nMonto pagado: $" + monto.toFixed(2) +
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
                    text: "No se cargó jsPDF. El pago sí fue registrado.",
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

            // TÍTULO
            pdf.setFontSize(15);
            pdf.setTextColor(0, 0, 0);

            pdf.text(
                "COMPROBANTE DE PAGO DE SERVICIOS",
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

            // DATOS DEL SERVICIO
            pdf.text("Servicio:", 25, 125);

            const nombreServicio = pdf.splitTextToSize(
                servicio,
                100
            );

            pdf.text(nombreServicio, 85, 125);

            pdf.text("Numero de factura:", 25, 145);
            pdf.text(factura, 85, 145);

            // DATOS FINANCIEROS
            pdf.text("Monto pagado:", 25, 160);
            pdf.text("$" + monto.toFixed(2), 85, 160);

            pdf.text("Saldo anterior:", 25, 170);
            pdf.text("$" + saldoActual.toFixed(2), 85, 170);

            pdf.text("Saldo restante:", 25, 180);
            pdf.text("$" + nuevoSaldo.toFixed(2), 85, 180);

            // PIE DEL COMPROBANTE
            pdf.setDrawColor(25, 55, 105);
            pdf.line(20, 195, 190, 195);

            pdf.setFontSize(10);
            pdf.setTextColor(90, 90, 90);

            pdf.text(
                "Pago realizado exitosamente.",
                105,
                207,
                { align: "center" }
            );

            pdf.text(
                "Gracias por utilizar Pokemon Bank.",
                105,
                215,
                { align: "center" }
            );

            // ==========================================
            // DESCARGAR PDF
            // ==========================================

            pdf.save(
                "PokemonBank_Servicio_" +
                transaccion.id +
                ".pdf"
            );

            // Regresar al menú
            window.location.href = "menu.html";

        });

    });

}