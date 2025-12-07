document.addEventListener("DOMContentLoaded", () => {

  function resetUI() {
  select.value = "";
  info.textContent = "";
  btnEliminar.disabled = true;
  }


  const select = document.getElementById("select-movimiento");
  const btnEliminar = document.getElementById("btn-eliminar");
  const info = document.getElementById("info-movimiento");

  btnEliminar.disabled = true;

  function obtenerMovimientos() {
    return JSON.parse(localStorage.getItem("movimientos")) || [];
  }

  function cargarSelect() {
    select.innerHTML = `<option value="">-- Selecciona --</option>`;
    obtenerMovimientos().forEach(m => {
      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = `ID ${m.id} - ${m.intencion}`;
      select.appendChild(option);
    });
  }

  select.addEventListener("change", () => {
    const movimientos = obtenerMovimientos();
    const mov = movimientos.find(m => m.id === Number(select.value));

    if (!mov) {
      btnEliminar.disabled = true;
      info.textContent = "";
      return;
    }

    info.textContent = `
      Monto: $${mov.monto}
      | Fecha: ${mov.fecha}
      | Tipo: ${mov.tipo}
    `;

    btnEliminar.disabled = false;
  });

  btnEliminar.addEventListener("click", () => {
    const id = Number(select.value);
    let movimientos = obtenerMovimientos();

    if (!confirm("¿Seguro que deseas eliminar este movimiento?")) 
        {
            resetUI();
            return
        };

    movimientos = movimientos.filter(m => m.id !== id);

    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    alert("Movimiento eliminado correctamente.");

    resetUI();
    cargarSelect();
  });

  cargarSelect();
});
