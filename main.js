/* =========================================================
   Café Aroma - script.js
   Carrito de compras simulado + validación del formulario
   ========================================================= */
 
/* ---------- PASO 1: Seleccionar los elementos del HTML ---------- */
const listaCarrito = document.getElementById("lista-carrito");
const mensajeVacio = document.getElementById("carrito-vacio");
const totalElemento = document.getElementById("total");
const contador = document.getElementById("contador");
const botonVaciar = document.getElementById("btn-vaciar");
const botonesAgregar = document.querySelectorAll(".producto button");
 
/* ---------- PASO 2: Estado del carrito ----------
   Es un arreglo de objetos: { id, nombre, precio, cantidad } */
let carrito = [];
 
/* Convierte un número a texto de dinero: 3.5 -> "$3.50" */
function formatearPrecio(valor) {
  return "$" + valor.toFixed(2);
}
 
/* ---------- PASO 3: Agregar un producto ---------- */
function agregarAlCarrito(producto) {
  // ¿El producto ya está en el carrito?
  const existente = carrito.find(function (item) {
    return item.id === producto.id;
  });
 
  if (existente) {
    existente.cantidad += 1;          // Si ya existe, solo sumamos 1
  } else {
    carrito.push({ ...producto, cantidad: 1 }); // Si no, lo añadimos
  }
  dibujarCarrito();
}
 
/* ---------- PASO 4: Eliminar un producto ---------- */
function eliminarDelCarrito(id) {
  // filter conserva todos los productos MENOS el que tiene ese id
  carrito = carrito.filter(function (item) {
    return item.id !== id;
  });
  dibujarCarrito();
}
 
/* ---------- PASO 5: Vaciar todo el carrito ---------- */
function vaciarCarrito() {
  carrito = [];
  dibujarCarrito();
}
 
/* ---------- PASO 6: Dibujar el carrito en pantalla (manipulación del DOM) ----------
   Se llama cada vez que el carrito cambia. Así el total
   y la lista siempre están actualizados en tiempo real. */
function dibujarCarrito() {
  listaCarrito.innerHTML = ""; // Limpiamos la lista
  let total = 0;
  let cantidadTotal = 0;
 
  carrito.forEach(function (item) {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    cantidadTotal += item.cantidad;
 
    // Crear los elementos del DOM
    const li = document.createElement("li");
 
    const info = document.createElement("span");
    info.className = "item-info";
    info.textContent =
      item.nombre + " x" + item.cantidad + " — " + formatearPrecio(subtotal);
 
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn-eliminar";
    botonEliminar.textContent = "Quitar";
    botonEliminar.setAttribute("aria-label", "Quitar " + item.nombre + " del carrito");
    botonEliminar.addEventListener("click", function () {
      eliminarDelCarrito(item.id);
    });
 
    li.appendChild(info);
    li.appendChild(botonEliminar);
    listaCarrito.appendChild(li);
  });
 
  // Actualizar total, contador del menú y mensaje de carrito vacío
  totalElemento.textContent = formatearPrecio(total);
  contador.textContent = cantidadTotal;
  mensajeVacio.hidden = carrito.length > 0;
  botonVaciar.disabled = carrito.length === 0;
}
 
/* ---------- PASO 7: Conectar los botones con las funciones ---------- */
botonesAgregar.forEach(function (boton) {
  boton.addEventListener("click", function () {
    agregarAlCarrito({
      id: boton.dataset.id,
      nombre: boton.dataset.nombre,
      precio: parseFloat(boton.dataset.precio),
    });
  });
});
 
botonVaciar.addEventListener("click", vaciarCarrito);
 
/* =========================================================
   VALIDACIÓN DEL FORMULARIO
   ========================================================= */
const formulario = document.getElementById("formulario");
const campoNombre = document.getElementById("nombre");
const campoCorreo = document.getElementById("correo");
const campoFecha = document.getElementById("fecha");
const campoMensaje = document.getElementById("mensaje");
const mensajeForm = document.getElementById("mensaje-form");
 
/* Expresión regular sencilla para comprobar el formato del correo */
const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
/* Muestra un mensaje de error o éxito debajo del formulario */
function mostrarMensaje(texto, tipo) {
  mensajeForm.textContent = texto;
  mensajeForm.className = tipo; // "error" o "exito" (colores en el CSS)
}
 
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // Evita que la página se recargue
 
  // Quitar marcas de error anteriores
  [campoNombre, campoCorreo, campoFecha, campoMensaje].forEach(function (campo) {
    campo.classList.remove("invalido");
  });
 
  const nombre = campoNombre.value.trim();
  const correo = campoCorreo.value.trim();
  const fecha = campoFecha.value;
  const mensaje = campoMensaje.value.trim();
 
  // Comprobar cada campo; al primer error mostramos el mensaje y salimos
  if (nombre === "") {
    campoNombre.classList.add("invalido");
    campoNombre.focus();
    return mostrarMensaje("Escribe tu nombre.", "error");
  }
  if (!patronCorreo.test(correo)) {
    campoCorreo.classList.add("invalido");
    campoCorreo.focus();
    return mostrarMensaje("Escribe un correo válido, por ejemplo nombre@ejemplo.com.", "error");
  }
  if (fecha === "" || new Date(fecha) < new Date()) {
    campoFecha.classList.add("invalido");
    campoFecha.focus();
    return mostrarMensaje("Elige una fecha y hora de visita que no haya pasado.", "error");
  }
  if (mensaje === "") {
    campoMensaje.classList.add("invalido");
    campoMensaje.focus();
    return mostrarMensaje("Escribe un mensaje.", "error");
  }
 
  // Todo correcto
  mostrarMensaje("¡Gracias, " + nombre + "! Recibimos tu reserva y te escribiremos pronto.", "exito");
  formulario.reset();
});
 
/* Dibujar el carrito al cargar la página (muestra el estado vacío) */
dibujarCarrito();