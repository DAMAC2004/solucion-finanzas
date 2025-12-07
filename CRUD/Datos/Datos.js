// Datos.js
// Maneja Exportar / Importar / Crear nuevos datos desde la página "Datos"

// ----------------- Helpers básicos -----------------

/**
 * Obtiene los movimientos almacenados en localStorage.
 * Si no existe la clave "movimientos", devuelve un arreglo vacío.
 */
function obtenerMovimientos() {
  return JSON.parse(localStorage.getItem("movimientos")) || [];
}

/**
 * Guarda los movimientos en localStorage (sobrescribe).
 * @param {Array} datos 
 */
function guardarMovimientos(datos) {
  localStorage.setItem("movimientos", JSON.stringify(datos));
}

/**
 * Calcula el saldo (suma de montos).
 * @param {Array} datos 
 * @returns {number}
 */
function calcularSaldo(datos) {
  return datos.reduce((acc, m) => acc + Number(m.monto || 0), 0);
}

/**
 * Devuelve los últimos n movimientos (ordenados por aparición en el arreglo).
 * Si hay menos de n, devuelve lo que haya.
 */
function ultimosMovimientos(datos, n = 3) {
  return datos.slice(-n);
}

/**
 * Valida la estructura esperada del JSON.
 * Esperamos un arreglo de objetos con las keys: id (number), monto (number),
 * intencion (string), fecha (string) y tipo (string 'debito'|'credito').
 * Devuelve true si todo OK, false si no.
 */
function estructuraValida(datos) {
  if (!Array.isArray(datos)) return false;
  for (const item of datos) {
    if (typeof item !== "object" || item === null) return false;
    if (typeof item.id !== "number") return false;
    if (typeof item.monto !== "number") return false;
    if (typeof item.intencion !== "string") return false;
    if (typeof item.fecha !== "string") return false;
    if (typeof item.tipo !== "string") return false;
    if (!["debito", "credito"].includes(item.tipo)) return false;
  }
  return true;
}

// ----------------- Render / UI helpers -----------------

/**
 * Rellena la tabla de previsualización en la página de Datos.
 * Usa el tbody con id="tabla-movimientos" y el label id="saldo-actual".
 */
function renderPreviewTabla() {
  const datos = obtenerMovimientos();
  const tbody = document.getElementById("tabla-movimientos");
  const saldoLabel = document.getElementById("saldo-actual");

  // Limpiamos la tabla
  tbody.innerHTML = "";

  // Actualizamos saldo
  saldoLabel.textContent = calcularSaldo(datos).toFixed(2);

  if (datos.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5">No hay movimientos registrados</td>`;
    tbody.appendChild(tr);
    return;
  }

  // Insertar solo los últimos 3 (o menos)
  const ultimos = ultimosMovimientos(datos, 3);
  for (const m of ultimos) {
    const tr = document.createElement("tr");
    // Aplicamos clases para estilos (positivo/negativo y debito/credito)
    const montoClass = Number(m.monto) < 0 ? "negativo" : "positivo";
    tr.innerHTML = `
      <td>${m.id}</td>
      <td class="${montoClass}">${Number(m.monto).toFixed(2)}</td>
      <td>${m.intencion}</td>
      <td>${m.fecha}</td>
      <td class="${m.tipo}">${m.tipo}</td>
    `;
    tbody.appendChild(tr);
  }
}

/**
 * Crea y muestra un modal de confirmación personalizado con HTML.
 * title: texto del título, htmlContent: HTML (string) dentro del modal,
 * actions: array de { text, action, primary } donde action es una función.
 * Devuelve la referencia al modal creado (para poder cerrarlo desde afuera si se quiere).
 */
function showModal({ title = "", htmlContent = "", actions = [] }) {
  // Overlay
  const overlay = document.createElement("div");
  overlay.className = "cg-modal-overlay";

  // Modal
  const modal = document.createElement("div");
  modal.className = "cg-modal";

  // Header
  const h = document.createElement("h3");
  h.textContent = title;
  modal.appendChild(h);

  // Content
  const content = document.createElement("div");
  content.className = "cg-modal-content";
  content.innerHTML = htmlContent;
  modal.appendChild(content);

  // Actions container
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "cg-modal-actions";

  actions.forEach(act => {
    const btn = document.createElement("button");
    btn.textContent = act.text;
    btn.className = act.primary ? "cg-btn-primary" : "cg-btn";
    btn.addEventListener("click", () => {
      try { act.action(); } catch (err) { console.error(err); }
      // por defecto cerramos el modal después de ejecutar la acción
      document.body.removeChild(overlay);
    });
    actionsDiv.appendChild(btn);
  });

  modal.appendChild(actionsDiv);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Devolver función para cerrar programáticamente
  return {
    close: () => { if (document.body.contains(overlay)) document.body.removeChild(overlay); },
    overlay,
    modal
  };
}

/**
 * Función utilitaria para descargar un objeto como archivo JSON.
 */
function downloadJSON(obj, filename = "datos.json") {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ----------------- Flujos: Exportar / Importar / Crear -----------------

/**
 * Flujo de exportar:
 * - Muestra una vista previa con últimos 3 movimientos
 * - Pide nombre de archivo
 * - Si confirma, descarga el JSON (no modifica localStorage)
 */
function flujoExportar() {
  const datos = obtenerMovimientos();
  const ultimos = ultimosMovimientos(datos, 3);

  // Construimos HTML simple para la previsualización
  let html = `<p>Se exportarán los datos actuales a un archivo JSON. Esto <strong>no</strong> modifica tus datos.</p>`;
  html += `<h4>Últimos ${ultimos.length} movimientos</h4>`;
  html += `<ul>`;
  for (const m of ultimos) {
    html += `<li>ID ${m.id} — ${m.intencion} — ${Number(m.monto).toFixed(2)} — ${m.fecha} — ${m.tipo}</li>`;
  }
  html += `</ul>`;
  html += `<label>Nombre del archivo: <input id="cg-filename" placeholder="mis-datos.json" value="mis-datos.json"></label>`;

  const modal = showModal({
    title: "Exportar datos",
    htmlContent: html,
    actions: [
      {
        text: "Cancelar",
        action: () => {},
        primary: false
      },
      {
        text: "Exportar",
        action: () => {
          const filenameInput = document.getElementById("cg-filename");
          const filename = (filenameInput && filenameInput.value.trim()) ? filenameInput.value.trim() : "mis-datos.json";
          downloadJSON(datos, filename);
          alert("Datos exportados correctamente.");
        },
        primary: true
      }
    ]
  });

  return modal;
}

/**
 * Flujo de importar:
 * - Se pasa el File (archivo .json)
 * - Validamos parse y estructura
 * - Si válido, mostramos modal con últimos 3 del archivo y pedimos confirmación
 * - Si confirma, reemplazamos datos en localStorage
 */
function flujoImportar(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    let parsed;
    try {
      parsed = JSON.parse(e.target.result);
    } catch (err) {
      alert("El archivo no contiene JSON válido. Operación cancelada.");
      return;
    }

    // Si es vacío (archivo vacío o contenido vacio -> parsed podría ser undefined/null)
    if (parsed == null) {
      // inicializar estructura vacía
      const confirmEmpty = confirm("El archivo JSON está vacío. Se inicializarán datos vacíos. ¿Deseas continuar?");
      if (!confirmEmpty) return;
      guardarMovimientos([]);
      renderPreviewTabla();
      alert("LocalStorage inicializado como vacío.");
      return;
    }

    // Validar estructura
    if (!estructuraValida(parsed)) {
      alert("La estructura del JSON no coincide con la esperada. No se importó nada.");
      return;
    }

    // Previsualización de los últimos 3 del archivo a importar
    const ultimosArchivo = ultimosMovimientos(parsed, 3);
    let html = `<p>Al importar, los datos actuales se eliminarán y serán reemplazados por los del archivo.</p>`;
    html += `<h4>Últimos ${ultimosArchivo.length} movimientos del archivo</h4><ul>`;
    ultimosArchivo.forEach(m => {
      html += `<li>ID ${m.id} — ${m.intencion} — ${Number(m.monto).toFixed(2)} — ${m.fecha} — ${m.tipo}</li>`;
    });
    html += `</ul>`;

    showModal({
      title: "Importar datos (reemplazar actuales)",
      htmlContent: html,
      actions: [
        {
          text: "Cancelar",
          action: () => {},
          primary: false
        },
        {
          text: "Importar y reemplazar",
          action: () => {
            guardarMovimientos(parsed);
            renderPreviewTabla();
            alert("Datos importados y guardados en localStorage correctamente.");
          },
          primary: true
        }
      ]
    });
  };

  reader.onerror = () => {
    alert("Error leyendo el archivo. Intenta nuevamente.");
  };

  reader.readAsText(file, "utf-8");
}

/**
 * Flujo crear nuevos datos:
 * - Muestra últimos 3 actuales y sugiere exportar antes
 * - Opciones: Exportar antes (te pide un nombre y descarga), Crear vacíos, Crear datos de ejemplo, Cancelar
 */
function flujoCrearNuevos() {
  const datosActuales = obtenerMovimientos();
  const ultimos = ultimosMovimientos(datosActuales, 3);

  let html = `<p>Esta acción eliminará todos los movimientos actuales.</p>`;
  html += `<h4>Últimos ${ultimos.length} movimientos actuales</h4><ul>`;
  ultimos.forEach(m => {
    html += `<li>ID ${m.id} — ${m.intencion} — ${Number(m.monto).toFixed(2)} — ${m.fecha} — ${m.tipo}</li>`;
  });
  html += `</ul>`;
  html += `<p>¿Deseas exportar antes de borrarlos?</p>`;

  showModal({
    title: "Crear nuevos datos",
    htmlContent: html,
    actions: [
      {
        text: "Cancelar",
        action: () => {},
        primary: false
      },
      {
        text: "Exportar y vaciar",
        action: () => {
          // Pedir nombre de archivo mediante prompt (simple)
          const filename = prompt("Nombre de archivo para exportar (ej: respaldo.json)", "respaldo-datos.json");
          if (filename === null) {
            // El usuario canceló el prompt
            return;
          }
          downloadJSON(datosActuales, filename || "respaldo-datos.json");
          // Luego vaciamos
          guardarMovimientos([]);
          renderPreviewTabla();
          alert("Datos exportados y localStorage vaciado.");
        },
        primary: false
      },
      {
        text: "Vaciar sin exportar",
        action: () => {
          guardarMovimientos([]);
          renderPreviewTabla();
          alert("LocalStorage vaciado. Ahora puedes empezar desde cero.");
        },
        primary: true
      }
    ]
  });
}

// ----------------- Inicialización: vincular botones y cargar vista -----------------

document.addEventListener("DOMContentLoaded", () => {
  // Botones/elementos en la página
  const btnExportar = document.getElementById("btn-exportar");
  const inputImportar = document.getElementById("input-importar");
  const btnCrear = document.getElementById("btn-crear-nuevos");

  // Render inicial de la tabla/saldo
  renderPreviewTabla();

  // Exportar: abre modal y pide nombre
  if (btnExportar) {
    btnExportar.addEventListener("click", () => {
      flujoExportar();
    });
  }

  // Importar: cuando el usuario selecciona un archivo
  if (inputImportar) {
    inputImportar.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      flujoImportar(file);
      // limpiar input para permitir re-importar el mismo archivo si se desea
      inputImportar.value = "";
    });
  }

  // Crear nuevos: flujo con opción de exportar antes o vaciar
  if (btnCrear) {
    btnCrear.addEventListener("click", () => {
      flujoCrearNuevos();
    });
  }
});
