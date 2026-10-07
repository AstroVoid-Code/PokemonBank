const loginForm = document.getElementById("loginForm");
const pinInput = document.getElementById("pin");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const pin = pinInput.value;

    if (pin === "1234") {

        window.location.href = "menu.html";

    } else {

        alert("PIN incorrecto. Intenta nuevamente.");
        pinInput.value = "";
        pinInput.focus();

    }

});