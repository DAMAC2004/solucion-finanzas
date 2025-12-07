

// Cuando el DOM esté cargado completamente
document.addEventListener("DOMContentLoaded", () => {

    // Funciones para habilitar y deshabilitar el formulario
    function deshabilitarForm() {
        form.querySelectorAll("input, select, button")
            .forEach(el => el.disabled = true);
    }

    function habilitarForm() {
    form.querySelectorAll("input, select, button")
        .forEach(el => el.disabled = false);
    }

  // Referencias a elementos del DOM
  const select = document.getElementById("select-movimiento");
  const form = document.getElementById("form-editar");
  // Deshabilitamos el formulario al inicio
    deshabilitarForm();

  // Referencias a los inputs
  const montoInput = document.getElementById("monto");
  const intencionInput = document.getElementById("intencion");
  const fechaInput = document.getElementById("fecha");
  const tipoInput = document.getElementById("tipo");

  // Función para obtener los movimientos desde localStorage
  function obtenerMovimientos() {
    return JSON.parse(localStorage.getItem("movimientos")) || [];
  }

    // Función para cargar el select con los movimientos
  function cargarSelect() {
    select.innerHTML = `<option value="">-- Selecciona --</option>`;

    // Obtener movimientos
    const movimientos = obtenerMovimientos();

    // Llenar el select
    movimientos.forEach(m => {
      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = `ID ${m.id} - ${m.intencion}`;
      select.appendChild(option);
    });
  }

    // Evento cuando se selecciona un movimiento
  select.addEventListener("change", () => {
    const movimientos = obtenerMovimientos();

    // Buscar el movimiento seleccionado
    const movimiento = movimientos.find(
      m => m.id === Number(select.value)
    );

    // Si no se encuentra, salir
    if (!movimiento) return;

    // Llenar los inputs con los datos del movimiento
    montoInput.value = movimiento.monto;
    intencionInput.value = movimiento.intencion;
    fechaInput.value = movimiento.fecha;
    tipoInput.value = movimiento.tipo;

    // Habilitar el formulario
    habilitarForm();

  });

  // Evento cuando se envía el formulario
  form.addEventListener("submit", e => {
    e.preventDefault();

    // Obtener movimientos
    const movimientos = obtenerMovimientos();
    const idSeleccionado = Number(select.value);

    // Actualizar el movimiento correspondiente
    const index = movimientos.findIndex(
      m => m.id === idSeleccionado
    );

    // Si no se encuentra, salir
    if (index === -1) return;

    // Actualizar los datos
    movimientos[index] = {
      id: idSeleccionado,
      monto: Number(montoInput.value),
      intencion: intencionInput.value,
      fecha: fechaInput.value,
      tipo: tipoInput.value
    };

    // Guardar de nuevo en localStorage
    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    alert("Movimiento actualizado exitosamente.");

    // Limpiamos el formulario
    form.reset();
    select.value = "";

    // Deshabilitar nuevamente
    deshabilitarForm();
  });

    // Cargar el select al inicio
  cargarSelect();
});
