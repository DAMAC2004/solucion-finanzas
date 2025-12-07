document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("tabla-movimientos");

  function obtenerMovimientos() {
    return JSON.parse(localStorage.getItem("movimientos")) || [];
  }

  function cargarTabla() {
    const movimientos = obtenerMovimientos();
    tbody.innerHTML = "";

    // Caso: no hay datos
    if (movimientos.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "No hay movimientos registrados";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    
    // Recorremos cada movimiento
    movimientos.forEach(m => {
      const tr = document.createElement("tr");

      // Calcular y mostrar saldo actual
      let saldoActual = movimientos.reduce((acc, mov) => acc + mov.monto, 0);

      const saldoTd = document.getElementById("saldo-actual");
      saldoTd.textContent = saldoActual.toFixed(2);

      if (!(m.monto < 0)) {
        saldoTd.classList.add("negativo");
        saldoTd.classList.remove("positivo");
      } else {
        saldoTd.classList.add("positivo");
        saldoTd.classList.remove("negativo");
      }

      // ID
      const idTd = document.createElement("td");
      idTd.textContent = m.id;

      // Monto
      const montoTd = document.createElement("td");
      montoTd.textContent = m.monto.toFixed(2);

      if (m.monto < 0) {
        montoTd.classList.add("negativo");
      } else {
        montoTd.classList.add("positivo");
      }

      // Intención
      const intencionTd = document.createElement("td");
      intencionTd.textContent = m.intencion;

      // Fecha
      const fechaTd = document.createElement("td");
      fechaTd.textContent = m.fecha;

      // Tipo
      const tipoTd = document.createElement("td");
      tipoTd.textContent = m.tipo;
      tipoTd.classList.add(m.tipo); // debito / credito

      // Agregar todo a la fila
      tr.appendChild(idTd);
      tr.appendChild(montoTd);
      tr.appendChild(intencionTd);
      tr.appendChild(fechaTd);
      tr.appendChild(tipoTd);

      // Agregar fila a la tabla
      tbody.appendChild(tr);
    });  
    
    document.getElementById("saldo-actual").textContent = saldoActual.toFixed(2);
  }

  cargarTabla();
});
