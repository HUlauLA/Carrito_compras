document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const alertBox = document.getElementById("form-alert");
  let alertTimeout = null;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombres = form.querySelector('input[aria-label="Nombres"]');
    const apellidos = form.querySelector('input[aria-label="Apellidos"]');
    const telefono = form.querySelector('input[aria-label="Télefono"]');
    const correo = form.querySelector('input[aria-label="Correo electrónico"]');
    const direccion = form.querySelector("#direccion");
    const tarjeta = form.querySelector('input[aria-label="Número de tarjeta"]');
    const titular = form.querySelector(
      'input[aria-label="Nombre del titular"]'
    );
    const mes = form.querySelector('input[aria-label="Mes de vencimiento"]');
    const anio = form.querySelector('input[aria-label="Año de vencimiento"]');
    const codigo = form.querySelector(
      'input[aria-label="Código de seguridad"]'
    );

    let isValid = true;
    let messages = [];

    function validateField(input, condition, msg) {
      if (!condition) {
        isValid = false;
        messages.push(msg);
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      }
    }

    validateField(
      nombres,
      nombres.value.trim() !== "",
      "El campo Nombres es obligatorio."
    );
    validateField(
      apellidos,
      apellidos.value.trim() !== "",
      "El campo Apellidos es obligatorio."
    );
    validateField(
      telefono,
      /^\d{8,}$/.test(telefono.value.trim()),
      "El teléfono debe tener al menos 8 dígitos numéricos."
    );
    validateField(
      correo,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()),
      "Ingrese un correo electrónico válido."
    );
    validateField(
      direccion,
      direccion.value.trim() !== "",
      "La dirección es obligatoria."
    );
    validateField(
      tarjeta,
      /^\d{16}$/.test(tarjeta.value.trim()),
      "El número de tarjeta debe tener 16 dígitos."
    );
    validateField(
      titular,
      titular.value.trim() !== "",
      "El nombre del titular es obligatorio."
    );
    validateField(
      mes,
      /^(0[1-9]|1[0-2])$/.test(mes.value.trim()),
      "El mes de vencimiento debe estar entre 01 y 12."
    );
    validateField(
      codigo,
      /^[0-9]{3}$/.test(codigo.value.trim()),
      "Código de seguridad inválido"
    );

    const currentYear = new Date().getFullYear();
    validateField(
      anio,
      /^\d{4}$/.test(anio.value.trim()) && parseInt(anio.value) >= currentYear,
      `El año de vencimiento debe ser mayor o igual a ${currentYear}.`
    );

    if (!isValid) {
      alertBox.innerHTML = messages.join("<br>");
      alertBox.classList.remove("d-none");

      if (alertTimeout) clearTimeout(alertTimeout);
      alertTimeout = setTimeout(() => {
        alertBox.classList.add("d-none");
      }, 5000);

      return;
    } else {
      alertBox.classList.add("d-none");
    }

    const userData = {
      nombres: nombres.value.trim(),
      apellidos: apellidos.value.trim(),
      telefono: telefono.value.trim(),
      correo: correo.value.trim(),
      direccion: direccion.value.trim(),
      tarjeta: tarjeta.value.trim(),
      titular: titular.value.trim(),
      mes: mes.value.trim(),
      anio: anio.value.trim(),
    };
    localStorage.setItem("userData", JSON.stringify(userData));

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let baseInventory =
      JSON.parse(localStorage.getItem("inventory_snapshot")) ||
      JSON.parse(localStorage.getItem("inventory")) ||
      [];

    // ✅ Descontar stock sobre baseInventory (no sobre "inventory")
    for (const item of cart) {
      const p = baseInventory.find(x => x.id === item.id);
      if (p) {
        const q = Number(item.qty) || 0;
        p.stock = Math.max(0, p.stock - q);
      }
    }

    // Guardar inventario final
    localStorage.setItem("inventory", JSON.stringify(baseInventory));
    localStorage.removeItem("inventory_snapshot");

    // Redirigir a la pantalla de compra completada
    location.href = "./purchase-completed.html";
  });

  const backBtn = document.getElementById("back-button");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Restaurar inventario previo (si había snapshot)
      const invSnap = localStorage.getItem("inventory_snapshot");
      if (invSnap) {
        localStorage.setItem("inventory", invSnap);
        localStorage.removeItem("inventory_snapshot");
      }

      // NO borres el carrito: el usuario quiere seguir editando
      location.href = "../index.html";
    });
  }
});
