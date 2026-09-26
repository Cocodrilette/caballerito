// PLUGIN DE VITE: "Guardar en el juego"
// Cuando usamos "npm run dev", el editor puede pedirle al servidor
// que escriba un nivel en la carpeta niveles/. Esto solo existe
// mientras programamos (no en el juego publicado).

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const NOMBRE_VALIDO = /^[a-z0-9_-]{1,40}$/;

export function guardarNiveles() {
  return {
    name: "caballerito-guardar-nivel",
    apply: "serve", // solo en modo desarrollo
    configureServer(servidor) {
      const carpeta = join(servidor.config.root, "niveles");

      servidor.middlewares.use("/api/guardar-nivel", async (pedido, respuesta) => {
        const contestar = (codigo, datos) => {
          respuesta.statusCode = codigo;
          respuesta.setHeader("Content-Type", "application/json");
          respuesta.end(JSON.stringify(datos));
        };
        if (pedido.method !== "POST") return contestar(405, { ok: false, error: "Usa POST" });

        try {
          const { archivo, nivel } = JSON.parse(await leerCuerpo(pedido));

          // Revisamos todo con cuidado antes de escribir.
          if (typeof archivo !== "string" || !NOMBRE_VALIDO.test(archivo) || archivo === "indice") {
            return contestar(400, { ok: false, error: "Nombre de archivo no válido (solo a-z, 0-9, - y _)." });
          }
          if (!nivel || !Array.isArray(nivel.mapa) || !nivel.mapa.every((f) => typeof f === "string")) {
            return contestar(400, { ok: false, error: "El nivel no tiene un mapa válido." });
          }

          await mkdir(carpeta, { recursive: true });
          await writeFile(join(carpeta, `${archivo}.json`), JSON.stringify(nivel, null, 2) + "\n");

          // Lo agregamos a la lista de niveles si no estaba.
          const rutaIndice = join(carpeta, "indice.json");
          let indice = { niveles: [] };
          try {
            indice = JSON.parse(await readFile(rutaIndice, "utf8"));
            if (!Array.isArray(indice.niveles)) indice.niveles = [];
          } catch {
            // No había índice: empezamos uno nuevo.
          }
          const nuevo = !indice.niveles.includes(archivo);
          if (nuevo) {
            indice.niveles.push(archivo);
            await writeFile(rutaIndice, JSON.stringify(indice, null, 2) + "\n");
          }
          contestar(200, { ok: true, nuevo });
        } catch (error) {
          contestar(500, { ok: false, error: String(error.message || error) });
        }
      });
    },
  };
}

function leerCuerpo(pedido) {
  return new Promise((listo, fallo) => {
    let cuerpo = "";
    pedido.on("data", (trozo) => {
      cuerpo += trozo;
      if (cuerpo.length > 2_000_000) fallo(new Error("Nivel demasiado grande"));
    });
    pedido.on("end", () => listo(cuerpo));
    pedido.on("error", fallo);
  });
}
