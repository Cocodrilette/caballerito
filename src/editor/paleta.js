// LA PALETA: los botones para elegir qué pintar.
// Se arma sola leyendo la LEYENDA, ¡así que si agregas una cosa
// nueva en src/leyenda.js, aparece aquí también!

import { LEYENDA } from "../leyenda.js";
import { estado, avisarCambio } from "./estado.js";
import { iconoDe } from "./dibujarSprite.js";

const HERRAMIENTAS = [
  { id: "lapiz", icono: "✏️", nombre: "Lápiz", descripcion: "Pinta bloque por bloque. Puedes arrastrar el mouse." },
  { id: "rellenar", icono: "🪣", nombre: "Rellenar", descripcion: "Pinta de un golpe todos los bloques iguales que se tocan." },
  { id: "borrador", icono: "🧽", nombre: "Borrador", descripcion: "Borra bloques. También puedes borrar con el clic derecho." },
];

// Títulos para agrupar las cosas según su tipo
const GRUPOS = {
  bloque: "🧱 Bloques",
  peligro: "⚠️ Peligros",
  jugador: "🧍 Jugador",
  objeto: "✨ Objetos",
  enemigo: "👾 Enemigos",
  decoracion: "🌿 Decoración",
};

let globito;

export function prepararPaleta() {
  globito = document.getElementById("globito");

  // Botones de herramientas
  const cajaHerramientas = document.getElementById("herramientas");
  for (const herramienta of HERRAMIENTAS) {
    const boton = document.createElement("button");
    boton.className = "herramienta";
    boton.dataset.herramienta = herramienta.id;
    boton.innerHTML = `<span class="icono">${herramienta.icono}</span><span>${herramienta.nombre}</span>`;
    boton.addEventListener("click", () => elegirHerramienta(herramienta.id));
    mostrarGlobitoAlPasar(boton, herramienta.nombre, herramienta.descripcion);
    cajaHerramientas.appendChild(boton);
  }

  // Botones de cosas, agrupados por tipo
  const cajaPaleta = document.getElementById("paleta");
  for (const [tipo, titulo] of Object.entries(GRUPOS)) {
    const cosas = LEYENDA.filter((cosa) => cosa.tipo === tipo);
    if (cosas.length === 0) continue;
    const h = document.createElement("h3");
    h.textContent = titulo;
    const grupo = document.createElement("div");
    grupo.className = "grupo";
    for (const cosa of cosas) grupo.appendChild(botonDeCosa(cosa));
    cajaPaleta.append(h, grupo);
  }
  // Cosas de tipos nuevos que no conocemos todavía
  const otras = LEYENDA.filter((c) => c.tipo !== "vacio" && !GRUPOS[c.tipo]);
  if (otras.length > 0) {
    const h = document.createElement("h3");
    h.textContent = "🎁 Otras";
    const grupo = document.createElement("div");
    grupo.className = "grupo";
    for (const cosa of otras) grupo.appendChild(botonDeCosa(cosa));
    cajaPaleta.append(h, grupo);
  }

  marcarElegidos();
}

function botonDeCosa(cosa) {
  const boton = document.createElement("button");
  boton.className = "cosa";
  boton.dataset.letra = cosa.simbolo;
  boton.setAttribute("aria-label", cosa.nombre);
  boton.appendChild(iconoDe(cosa.simbolo));
  const letra = document.createElement("span");
  letra.className = "letra";
  letra.textContent = cosa.simbolo;
  boton.appendChild(letra);
  boton.addEventListener("click", () => elegirLetra(cosa.simbolo));
  mostrarGlobitoAlPasar(boton, `${cosa.nombre}  «${cosa.simbolo}»`, cosa.descripcion);
  return boton;
}

export function elegirLetra(letra) {
  estado.letra = letra;
  // Si teníamos el borrador, volvemos al lápiz para pintar
  if (estado.herramienta === "borrador") estado.herramienta = "lapiz";
  avisarCambio("herramienta");
}

export function elegirHerramienta(id) {
  estado.herramienta = id;
  avisarCambio("herramienta");
}

// Pinta de dorado los botones que están elegidos.
export function marcarElegidos() {
  for (const b of document.querySelectorAll(".herramienta")) {
    b.classList.toggle("elegido", b.dataset.herramienta === estado.herramienta);
  }
  for (const b of document.querySelectorAll(".cosa")) {
    b.classList.toggle("elegido", b.dataset.letra === estado.letra && estado.herramienta !== "borrador");
  }
}

// El globito que explica cada botón
function mostrarGlobitoAlPasar(boton, titulo, texto) {
  boton.addEventListener("mouseenter", () => {
    globito.innerHTML = "";
    const b = document.createElement("b");
    b.textContent = titulo;
    const p = document.createElement("span");
    p.textContent = texto;
    globito.append(b, p);
    const caja = boton.getBoundingClientRect();
    globito.style.left = `${caja.right + 10}px`;
    globito.style.top = `${caja.top}px`;
    globito.classList.add("visible");
  });
  boton.addEventListener("mouseleave", () => globito.classList.remove("visible"));
}
