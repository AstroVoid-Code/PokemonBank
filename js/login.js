
 // ==========================================
 // POKÉMON BANK - FASE 2
 // INICIO DE SESIÓN
 // ==========================================

 const loginForm = document.getElementById("loginForm");
 const pinInput = document.getElementById("pin");

 // ==========================================
 // VALIDACIÓN DEL PIN
 // ==========================================

 loginForm.addEventListener("submit", function(event) {

     event.preventDefault();

     // Obtener los datos del usuario desde LocalStorage
     const usuario = obtenerUsuario();

     // Obtener el PIN ingresado
     const pin = pinInput.value.trim();

     // Validar que el PIN tenga exactamente 4 números
     if (!/^\d{4}$/.test(pin)) {

         swal({
             title: "PIN no válido",
             text: "Ingresa un PIN de 4 dígitos.",
             icon: "warning",
             button: "Aceptar"
         });

         pinInput.focus();
         return;
     }

     // Verificar que el usuario exista
     if (!usuario) {

         swal({
             title: "Error de usuario",
             text: "No se encontraron los datos de la cuenta.",
             icon: "error",
             button: "Aceptar"
         });

         return;
     }

     // ==========================================
     // VERIFICAR PIN
     // ==========================================

     if (pin === usuario.pin) {

         // Guardar estado de sesión
         sessionStorage.setItem(
             "sesionPokemonBank",
             "activa"
         );

         // Mensaje de bienvenida
         swal({
             title: "¡Bienvenido!",
             text: usuario.nombre,
             icon: "success",
             button: "Continuar"
         }).then(function() {

             window.location.href = "menu.html";

         });

     } else {

         swal({
             title: "PIN incorrecto",
             text: "Verifica tu PIN e intenta nuevamente.",
             icon: "error",
             button: "Aceptar"
         });

         pinInput.value = "";
         pinInput.focus();
     }

 });