
// ==========================================
// POKÉMON BANK - FASE 2
// DATOS GENERALES DEL USUARIO
// ==========================================

// Datos oficiales del usuario
const USUARIO_INICIAL = {
    nombre: "Ash Ketchum",
    pin: "1234",
    cuenta: "0987654321",
    saldo: 500.00
};

// ==========================================
// INICIALIZACIÓN DE LOCALSTORAGE
// ==========================================

// Crear usuario si todavía no existe
if (localStorage.getItem("usuarioPokemonBank") === null) {

    localStorage.setItem(
        "usuarioPokemonBank",
        JSON.stringify(USUARIO_INICIAL)
    );

}

// Crear saldo si todavía no existe
if (localStorage.getItem("saldoPokemonBank") === null) {

    localStorage.setItem(
        "saldoPokemonBank",
        String(USUARIO_INICIAL.saldo)
    );

}

// Crear historial si todavía no existe
if (localStorage.getItem("historialPokemonBank") === null) {

    localStorage.setItem(
        "historialPokemonBank",
        JSON.stringify([])
    );

}

// ==========================================
// DATOS DEL USUARIO
// ==========================================

// Obtener datos del usuario desde LocalStorage
function obtenerUsuario() {

    return JSON.parse(
        localStorage.getItem("usuarioPokemonBank")
    );

}

// ==========================================
// CONTROL DEL SALDO
// ==========================================

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
        String(nuevoSaldo)
    );

}

// ==========================================
// HISTORIAL DE TRANSACCIONES
// ==========================================

// Obtener historial almacenado
function obtenerHistorial() {

    return JSON.parse(
        localStorage.getItem("historialPokemonBank")
    ) || [];

}

// Registrar una nueva transacción
function registrarTransaccion(tipo, detalle, monto) {

    const historial = obtenerHistorial();

    const ahora = new Date();

    const nuevaTransaccion = {

        // Identificador de la transacción
        id: Date.now().toString(),

        // Fecha de la operación
        fecha: ahora.toLocaleDateString("es-SV"),

        // Hora de la operación
        hora: ahora.toLocaleTimeString("es-SV", {
            hour: "2-digit",
            minute: "2-digit"
        }),

        // Tipo de movimiento
        tipo: tipo,

        // Descripción de la operación
        detalle: detalle,

        // Cantidad depositada o retirada
        monto: monto

    };

    // Agregar movimiento al inicio del historial
    historial.unshift(nuevaTransaccion);

    // Guardar historial actualizado
    localStorage.setItem(
        "historialPokemonBank",
        JSON.stringify(historial)
    );

    // Devolver la transacción registrada
    return nuevaTransaccion;

}

// ==========================================
// CONTROL DE SESIÓN - FASE 2
// ==========================================

// Verificar si el usuario inició sesión
function verificarSesion() {

    const sesion = sessionStorage.getItem(
        "sesionPokemonBank"
    );

    // Si no hay sesión activa, regresar al login
    if (sesion !== "activa") {

        window.location.replace("index.html");

        return false;

    }

    return true;

}

// ==========================================
// CERRAR SESIÓN
// ==========================================

// Eliminar la sesión activa
function cerrarSesion() {

    sessionStorage.removeItem(
        "sesionPokemonBank"
    );

    // Regresar al inicio de sesión
    window.location.replace("index.html");

}