// ==========================================
// DATOS GENERALES - POKÉMON BANK
// ==========================================

// Saldo inicial del usuario
const SALDO_INICIAL = 2500;


// ==========================================
// SALDO
// ==========================================

// Crear saldo solamente si todavía no existe
if (localStorage.getItem("saldoPokemonBank") === null) {

    localStorage.setItem(
        "saldoPokemonBank",
        SALDO_INICIAL
    );

}


// Obtener saldo actual
function obtenerSaldo() {

    return parseFloat(
        localStorage.getItem("saldoPokemonBank")
    );

}


// Guardar nuevo saldo
function guardarSaldo(nuevoSaldo) {

    localStorage.setItem(
        "saldoPokemonBank",
        nuevoSaldo
    );

}


// ==========================================
// HISTORIAL DE TRANSACCIONES
// ==========================================

// Crear historial si todavía no existe
if (localStorage.getItem("historialPokemonBank") === null) {

    localStorage.setItem(
        "historialPokemonBank",
        JSON.stringify([])
    );

}


// Obtener historial
function obtenerHistorial() {

    return JSON.parse(
        localStorage.getItem("historialPokemonBank")
    );

}


// Registrar una nueva transacción
function registrarTransaccion(tipo, detalle, monto) {

    const historial = obtenerHistorial();

    const ahora = new Date();

    const nuevaTransaccion = {

        fecha: ahora.toLocaleDateString("es-SV"),

        hora: ahora.toLocaleTimeString(
            "es-SV",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ),

        tipo: tipo,

        detalle: detalle,

        monto: monto

    };

    historial.unshift(nuevaTransaccion);

    localStorage.setItem(
        "historialPokemonBank",
        JSON.stringify(historial)
    );

}