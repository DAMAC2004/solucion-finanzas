// Función para obtener el siguiente ID disponible
function obtenerSiguienteId() {
  // Obtenemos el último ID almacenado
  let ultimoId = localStorage.getItem("ultimoId");

  // Si no existe, iniciamos en 1
  if (ultimoId === null) {
    localStorage.setItem("ultimoId", "1");
    return 1;
  }

  // Incrementamos el ID y lo guardamos
  let nuevoId = Number(ultimoId) + 1;
  localStorage.setItem("ultimoId", String(nuevoId));
  return nuevoId;
}


// Esperamos a que el HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

  // Obtenemos el formulario por su ID
  const form = document.getElementById("form-agregar");

  // Escuchamos el evento cuando se envía el formulario
  form.addEventListener("submit", (e) => {

    // Evita que la página se recargue (comportamiento default del form)
    e.preventDefault();

    // Capturamos los valores de cada input
    const id = obtenerSiguienteId();
    const monto = document.getElementById("monto").value;
    const intencion = document.getElementById("intencion").value;
    const fecha = document.getElementById("fecha").value;
    const tipo = document.getElementById("tipo").value;

    // Creamos un objeto con los datos
    const movimiento = {
      id: id,
      monto: Number(monto),
      intencion,
      fecha,
      tipo
    };

    // Obtenemos los datos guardados (si no existen, usamos arreglo vacío)
    let datos = JSON.parse(localStorage.getItem("movimientos")) || [];

    // Agregamos el nuevo movimiento
    datos.push(movimiento);

    // Guardamos nuevamente en localStorage
    localStorage.setItem("movimientos", JSON.stringify(datos));

    // Feedback mínimo
    alert("Movimiento guardado exitosamente.");

    // Limpiamos el formulario
    form.reset();
  });
});
