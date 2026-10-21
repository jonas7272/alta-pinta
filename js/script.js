
/* ==================================
   ALTA PINTA - FUNCIONES PRINCIPALES
================================== */

// Productos de ejemplo basados en las publicaciones.
// Confirmar los precios antes de publicar la web.

const productos = [
    {
        id: 1,
        nombre: "Americana",
        categoria: "hamburguesas",
        descripcion: "Carne, cheddar, tomate, lechuga y salsa especial.",
        precio: null,
        imagen: "img/hamburguesa-americana.png"
    },
    {
        id: 2,
        nombre: "BBQ",
        categoria: "hamburguesas",
        descripcion: "Carne, cheddar, panceta, barbacoa y pepinillos.",
        precio: null,
        imagen: "img/hamburguesa-bbq.jpg"
    },
    {
        id: 3,
        nombre: "Alta Pinta Doble",
        categoria: "hamburguesas",
        descripcion: "Cheddar, pepinillos, tomate, cebolla morada, panceta y salsa especial.",
        precio: null,
        imagen: "img/hamburguesa-alta-pinta.png"
    },
    {
        id: 4,
        nombre: "Bacon Burger",
        categoria: "hamburguesas",
        descripcion: "Carne, cheddar, panceta, barbacoa y salsa especial.",
        precio: null,
        imagen: "img/hamburguesa-bacon.png"
    },

    {
        id: 5,
        nombre: "Coca-Cola lata",
        categoria: "bebidas",
        descripcion: "Lata individual de Coca-Cola.",
        precio: 2000,
        imagen: "img/coca-cola.png"
    },
    {
        id: 6,
        nombre: "Fanta lata",
        categoria: "bebidas",
        descripcion: "Lata individual de Fanta.",
        precio: 2000,
        imagen: "img/fanta.png"
    },
    {
        id: 7,
        nombre: "Sprite lata",
        categoria: "bebidas",
        descripcion: "Lata individual de Sprite.",
        precio: 2000,
        imagen: "img/sprite.png"
    }
];

// Elementos de la página
const productosGrid = document.getElementById("productosGrid");
const buscador = document.getElementById("buscador");
const botonesFiltro = document.querySelectorAll(".filtro");
const sinResultados = document.getElementById("sinResultados");

let categoriaActual = "todos";

// Formatear precios en pesos argentinos
function formatoPrecio(precio) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(precio);
}

// Crear una tarjeta para cada producto
function crearTarjeta(producto) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "producto-card";

    const precioHTML = producto.precio === null
        ? "Consultar precio"
        : formatoPrecio(producto.precio);

    tarjeta.innerHTML = `
        <div class="producto-imagen">
            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
                loading="lazy"
            >
        </div>

        <div class="producto-info">
            <span class="producto-categoria">
                ${producto.categoria}
            </span>

            <h3>${producto.nombre}</h3>

            <p>${producto.descripcion}</p>

            <div class="producto-pie">
                <strong>${precioHTML}</strong>

               <div class="producto-acciones">
    <button
        type="button"
        class="agregar-carrito"
        data-id="${producto.id}"
        aria-label="Agregar al carrito"
    >＋</button>

    <button
        type="button"
        class="boton-detalle"
        data-id="${producto.id}"
    >Ver detalle</button>
</div>
            </div>
        </div>
    `;

    // Mostrar una alternativa si falta la fotografía
    const imagen = tarjeta.querySelector("img");

    imagen.addEventListener("error", () => {
        imagen.style.display = "none";
        tarjeta.querySelector(".producto-imagen").classList.add("sin-imagen");
    });

    return tarjeta;
}

// Mostrar productos según el buscador y la categoría
function mostrarProductos() {
    const texto = buscador.value.trim().toLowerCase();

    const filtrados = productos.filter(producto => {
        const coincideCategoria =
            categoriaActual === "todos" ||
            producto.categoria === categoriaActual;

        const contenido =
            `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
            .toLowerCase();

        return coincideCategoria && contenido.includes(texto);
    });

    productosGrid.replaceChildren();

    filtrados.forEach(producto => {
        productosGrid.appendChild(crearTarjeta(producto));
    });

    sinResultados.hidden = filtrados.length > 0;
}

// Filtros de categorías
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        categoriaActual = boton.dataset.categoria;

        botonesFiltro.forEach(item => {
            item.classList.remove("activo");
        });

        boton.classList.add("activo");
        mostrarProductos();
    });
});

// Buscador
buscador.addEventListener("input", mostrarProductos);

// Detalle sencillo del producto
productosGrid.addEventListener("click", evento => {
    const boton = evento.target.closest(".boton-detalle");

    if (!boton) return;

    const producto = productos.find(
        item => item.id === Number(boton.dataset.id)
    );

    if (!producto) return;

    const precio = producto.precio === null
        ? "Precio a consultar"
        : formatoPrecio(producto.precio);

    alert(
        `${producto.nombre}\n\n` +
        `${producto.descripcion}\n\n` +
        `Precio: ${precio}`
    );
});

// Menú de navegación para celulares
const menuToggle = document.getElementById("menuToggle");
const navegacion = document.getElementById("navegacion");

if (menuToggle && navegacion) {
    menuToggle.addEventListener("click", () => {
        const abierto = navegacion.classList.toggle("abierto");

        menuToggle.setAttribute("aria-expanded", String(abierto));
        menuToggle.setAttribute(
            "aria-label",
            abierto ? "Cerrar menú" : "Abrir menú"
        );
    });

    navegacion.querySelectorAll("a").forEach(enlace => {
        enlace.addEventListener("click", () => {
            navegacion.classList.remove("abierto");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menú");
        });
    });
}

// Año automático en el pie de página
const anio = document.getElementById("anio");

if (anio) {
    anio.textContent = new Date().getFullYear();
}

// Cargar menú al abrir la página
mostrarProductos();

/* ===== AGREGAR PRODUCTOS AL CARRITO ===== */


const carritoAltaPinta = (() => {
    try {
        const guardado = JSON.parse(
            localStorage.getItem("altaPintaCarrito") || "[]"
        );

        return Array.isArray(guardado) ? guardado : [];
    } catch (error) {
        return [];
    }
})();


const botonCarrito = document.getElementById("abrirCarrito");
const contadorCarrito = document.getElementById("cantidadCarrito");
const ventanaCarrito = document.getElementById("modalCarrito");
const listaCarrito = document.getElementById("productosCarrito");
const totalCarritoElemento = document.getElementById("totalCarrito");

function actualizarCarritoAltaPinta() {
    
    try {
        localStorage.setItem(
            "altaPintaCarrito",
            JSON.stringify(carritoAltaPinta)
        );
    } catch (error) {
        console.warn("No se pudo guardar el carrito.", error);
    }

    const cantidad = carritoAltaPinta.reduce(
        (suma, producto) => suma + producto.cantidad,
        0
    );

    contadorCarrito.textContent = cantidad;

    if (carritoAltaPinta.length === 0) {
        listaCarrito.innerHTML =
            '<p class="carrito-vacio">Todavía no agregaste productos.</p>';
        totalCarritoElemento.textContent = "$0";
        return;
    }

    listaCarrito.innerHTML = carritoAltaPinta.map(producto => `
        <div class="item-carrito">
            <div class="item-carrito-info">
                <strong>${producto.nombre}</strong>
                <span>
                    ${producto.precio == null
                        ? "Consultar precio"
                        : formatoPrecio(producto.precio)}
                </span>
            </div>

            <div class="item-carrito-controles">
                <button type="button"
                    class="cambiar-cantidad"
                    data-id="${producto.id}"
                    data-cambio="-1">−</button>

                <span>${producto.cantidad}</span>

                <button type="button"
                    class="cambiar-cantidad"
                    data-id="${producto.id}"
                    data-cambio="1">＋</button>

                <button type="button"
                    class="quitar-producto"
                    data-id="${producto.id}">🗑️</button>
            </div>
        </div>
    `).join("");

    const faltaPrecio = carritoAltaPinta.some(
        producto => producto.precio == null
    );

    const total = carritoAltaPinta.reduce(
        (suma, producto) =>
            suma + (Number(producto.precio) || 0) * producto.cantidad,
        0
    );

    totalCarritoElemento.textContent = faltaPrecio
        ? "A confirmar"
        : formatoPrecio(total);
}

// Detectar el botón + de cada tarjeta.
document.getElementById("productosGrid").addEventListener("click", evento => {
    const boton = evento.target.closest(".agregar-carrito");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const producto = productos.find(item => item.id === id);
    if (!producto) return;

    const existente = carritoAltaPinta.find(item => item.id === id);

    if (existente) {
        existente.cantidad++;
    } else {
        carritoAltaPinta.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    actualizarCarritoAltaPinta();
});

// Abrir y cerrar la ventana del carrito.
botonCarrito.addEventListener("click", () => {
    ventanaCarrito.classList.add("abierto");
    ventanaCarrito.setAttribute("aria-hidden", "false");
});

document.getElementById("cerrarCarrito").addEventListener("click", () => {
    ventanaCarrito.classList.remove("abierto");
    ventanaCarrito.setAttribute("aria-hidden", "true");
});

ventanaCarrito.addEventListener("click", evento => {
    if (evento.target === ventanaCarrito) {
        ventanaCarrito.classList.remove("abierto");
        ventanaCarrito.setAttribute("aria-hidden", "true");
    }
});

// Aumentar, disminuir o eliminar productos.
listaCarrito.addEventListener("click", evento => {
    const botonCantidad = evento.target.closest(".cambiar-cantidad");
    const botonQuitar = evento.target.closest(".quitar-producto");

    if (botonCantidad) {
        const id = Number(botonCantidad.dataset.id);
        const cambio = Number(botonCantidad.dataset.cambio);
        const item = carritoAltaPinta.find(p => p.id === id);

        if (!item) return;

        item.cantidad += cambio;

        if (item.cantidad <= 0) {
            const indice = carritoAltaPinta.findIndex(p => p.id === id);
            carritoAltaPinta.splice(indice, 1);
        }

        actualizarCarritoAltaPinta();
    }

    if (botonQuitar) {
        const id = Number(botonQuitar.dataset.id);
        const indice = carritoAltaPinta.findIndex(p => p.id === id);

        if (indice !== -1) {
            carritoAltaPinta.splice(indice, 1);
        }

        actualizarCarritoAltaPinta();
    }
});

// Vaciar el carrito.
document.getElementById("vaciarCarrito").addEventListener("click", () => {
    carritoAltaPinta.length = 0;
    actualizarCarritoAltaPinta();
});

actualizarCarritoAltaPinta();


/* ===== FINALIZAR PEDIDO POR WHATSAPP ===== */

document.getElementById("finalizarPedido").addEventListener("click", function () {
    if (carritoAltaPinta.length === 0) {
        alert("Tu carrito está vacío. Agregá algún producto antes de continuar.");
        return;
    }

    const nombre = document.getElementById("nombreCliente").value.trim();
    const entrega = document.getElementById("tipoEntrega").value;
    const observaciones = document.getElementById("observacionesPedido").value.trim();

    if (!nombre) {
        alert("Por favor, escribí tu nombre antes de continuar.");
        document.getElementById("nombreCliente").focus();
        return;
    }

    const telefonoWhatsApp = "5492664973162";

    let mensaje = "¡Hola, Alta Pinta! Quiero realizar un pedido.\n\n";
    mensaje += "Nombre: " + nombre + "\n\n";
    mensaje += "PRODUCTOS:\n";

    carritoAltaPinta.forEach(function (producto) {
        mensaje += `• ${producto.cantidad} x ${producto.nombre}`;

        if (producto.precio == null) {
            mensaje += " — precio a consultar";
        } else {
            mensaje += ` — ${formatoPrecio(producto.precio)} c/u`;
        }

        mensaje += "\n";
    });

    const hayPreciosPendientes = carritoAltaPinta.some(
        producto => producto.precio == null
    );

    const total = carritoAltaPinta.reduce(function (suma, producto) {
        return suma + (Number(producto.precio) || 0) * producto.cantidad;
    }, 0);

    mensaje += "\n";

    if (hayPreciosPendientes) {
        mensaje += "Total: a confirmar con el local.\n";
    } else {
        mensaje += "Total estimado: " + formatoPrecio(total) + "\n";
    }

    mensaje += "\nModalidad: " + entrega + "\n";

    if (observaciones) {
        mensaje += "Aclaraciones: " + observaciones + "\n";
    }

    mensaje += "\n¿Me confirman el pedido, por favor?";

    const enlace = "https://wa.me/" + telefonoWhatsApp
        + "?text=" + encodeURIComponent(mensaje);

    window.open(enlace, "_blank");
});
