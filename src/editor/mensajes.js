// MENSAJES: avisos que aparecen un ratito y ventanitas con preguntas.

// Un aviso pequeño abajo de la pantalla. tipo: "bien", "ojo" o "mal".
export function avisar(texto, tipo = "bien") {
  const caja = document.getElementById("avisos");
  const aviso = document.createElement("div");
  aviso.className = `aviso aviso-${tipo}`;
  aviso.textContent = texto;
  caja.appendChild(aviso);
  setTimeout(() => aviso.classList.add("saliendo"), 3200);
  setTimeout(() => aviso.remove(), 3700);
}

// Abre una ventanita. Devuelve (con await) el valor del botón elegido.
// contenido: texto, lista de textos, o un elemento HTML.
// botones: [{ texto: "¡Sí!", valor: true, principal: true }, ...]
export function preguntar(titulo, contenido, botones) {
  const dialogo = document.getElementById("dialogo");
  dialogo.innerHTML = "";

  const h = document.createElement("h2");
  h.textContent = titulo;
  dialogo.appendChild(h);

  const cuerpo = document.createElement("div");
  cuerpo.className = "dialogo-cuerpo";
  if (typeof contenido === "string") {
    const p = document.createElement("p");
    p.textContent = contenido;
    cuerpo.appendChild(p);
  } else if (Array.isArray(contenido)) {
    const lista = document.createElement("ul");
    for (const linea of contenido) {
      const li = document.createElement("li");
      li.textContent = linea;
      lista.appendChild(li);
    }
    cuerpo.appendChild(lista);
  } else if (contenido) {
    cuerpo.appendChild(contenido);
  }
  dialogo.appendChild(cuerpo);

  const fila = document.createElement("div");
  fila.className = "dialogo-botones";
  dialogo.appendChild(fila);

  return new Promise((listo) => {
    for (const boton of botones) {
      const b = document.createElement("button");
      b.textContent = boton.texto;
      b.className = boton.principal ? "boton principal" : "boton";
      b.addEventListener("click", () => {
        dialogo.close();
        listo(boton.valor);
      });
      fila.appendChild(b);
    }
    // Si cierran con Escape, es como decir "no"
    dialogo.onclose = () => listo(null);
    dialogo.showModal();
    fila.querySelector(".principal")?.focus();
  });
}

// Pide un texto corto (por ejemplo, el nombre de un archivo).
export async function pedirTexto(titulo, explicacion, valorInicial) {
  const caja = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = explicacion;
  const entrada = document.createElement("input");
  entrada.type = "text";
  entrada.className = "entrada-grande";
  entrada.value = valorInicial;
  entrada.id = "entradaDialogo";
  caja.append(p, entrada);
  setTimeout(() => entrada.select(), 50);
  entrada.addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.querySelector("#dialogo .principal")?.click();
  });
  const ok = await preguntar(titulo, caja, [
    { texto: "Cancelar", valor: false },
    { texto: "¡Listo!", valor: true, principal: true },
  ]);
  return ok ? entrada.value.trim() : null;
}
