# 💰 Gestor de Finanzas Personales (JSON + LocalStorage)

Aplicación web sencilla para registrar, visualizar y gestionar movimientos financieros
(ingresos y egresos), almacenados en **LocalStorage** y exportables/importables en formato **JSON**.

El objetivo principal del proyecto es **aprender y aplicar buenas prácticas de UX, manejo de datos y estructuras**, sin depender de backend.

---

## 🚀 Funcionalidades principales

- ✅ Agregar movimientos financieros (débito / crédito)
- ✅ Visualizar registros almacenados
- ✅ Editar y eliminar movimientos
- ✅ Visualizar saldo actual y últimos movimientos
- ✅ Exportar datos a archivo JSON
- ✅ Importar datos desde archivo JSON (con validaciones)
- ✅ Reiniciar datos de forma controlada

---

## 📂 Estructura de datos

Cada movimiento contiene:

- `id` (number)
- `monto` (number)
- `intencion` (string)
- `fecha` (string)
- `tipo` (`"debito"` | `"credito"`)

Los datos se almacenan en una estructura JSON válida y se cargan al **LocalStorage** para su uso en la aplicación.

---

## 🧠 Principios de UX aplicados

La aplicación prioriza **seguridad, claridad y control del usuario**, especialmente en acciones sensibles.

### 🔹 Vista previa constante
- Se muestran:
  - Saldo actual
  - Últimos 3 movimientos
- Esto ayuda al usuario a entender el estado actual antes de cualquier acción.

---

## 📤 Exportar datos

- No modifica los datos existentes.
- Flujo:
  1. Vista del saldo y últimos movimientos
  2. Confirmación clara
  3. Descarga de archivo `.json`
- Mensajes explícitos que generan confianza:
  > “Se exportarán los datos actuales. Esto no modifica tus datos.”

---

## 📥 Importar datos (acción crítica)

- La aplicación **no sobrescribe datos sin validación**.
- Reglas:
  - JSON vacío → se inicializa estructura
  - JSON con estructura inválida → no se toca nada
  - JSON válido → se reemplazan los datos
- Siempre se alerta al usuario que los datos actuales serán eliminados.

---

## 🗑️ Crear datos nuevos (borrado total)

- Acción separada y claramente identificada.
- Incluye:
  - Advertencia clara
  - Confirmación explícita
  - Sugerencia de exportar antes de borrar

---

## 🎨 Interfaz

- Uso de tarjetas (`.card`) para separar acciones
- Colores semánticos:
  - Montos positivos → verde
  - Montos negativos → rojo
- Menú lateral para navegación clara entre secciones

---

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3 (variables CSS y estilos globales)
- JavaScript vanilla
- LocalStorage
- Archivos JSON

---

## 📌 Consideraciones

- No utiliza backend
- Los datos solo existen en el navegador del usuario
- Ideal para proyectos académicos, práctica de JS o prototipo de gestión financiera

---

## ✅ Estado del proyecto

Proyecto funcional y estable.
Abierto a futuras mejoras como:
- Filtros
- Búsqueda
- Gráficas
- Backend real

---

