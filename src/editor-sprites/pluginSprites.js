// PLUGIN DE VITE: el Taller de Dibujos lee y guarda los archivos de src/sprites/.
// Solo existe mientras programamos con "npm run dev".

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import {
  NOMBRE_ARCHIVO, leerComentarios, revisarDibujo, escribirSprite, cambiarPaletaComun,
} from "./escribir.js";

export function tallerDeDibujos() {
  return {
    name: "caballerito-taller-dibujos",
    apply: "serve", // solo en modo desarrollo
    configureServer(servidor) {
      const carpeta = join(servidor.config.root, "src", "sprites");
      const rutaPaleta = join(carpeta, "paleta.js");

      // Carga un archivo como módulo, siempre fresco (sin recuerdos viejos).
      // Usamos solo el lado "ssr" para no mezclarlo con las páginas.
      const ssr = servidor.environments.ssr;
      async function cargar(ruta) {
        for (const modulo of ssr.moduleGraph.getModulesByFile(ruta) ?? []) {
          ssr.moduleGraph.invalidateModule(modulo);
        }
        return ssr.runner.import(ruta);
      }

      async function leerDibujo(archivo, comun) {
        const ruta = join(carpeta, `${archivo}.js`);
        const fuente = await readFile(ruta, "utf8");
        const sprite = (await cargar(ruta)).default;
        const notas = leerComentarios(fuente);

        // "Propios" son los colores que el dibujo agrega o cambia.
        const propios = Object.entries(sprite.paleta)
          .filter(([letra, color]) => letra !== "." && comun[letra] !== color)
          .map(([letra, color]) => ({ letra, color, ...(notas.paleta[letra] ?? { comentario: "", hueco: " " }) }));

        const animaciones = Object.entries(sprite.animaciones).map(([nombre, datos]) => {
          const extra = notas.animaciones[nombre] ?? { comentario: "", etiquetas: [] };
          return {
            nombre,
            comentario: extra.comentario,
            velocidad: datos.velocidad ?? 6,
            repetir: datos.repetir ?? true,
            cuadros: datos.cuadros.map((filas, c) => ({ etiqueta: extra.etiquetas[c] ?? "", filas: [...filas] })),
          };
        });
        return { archivo, nombre: sprite.nombre ?? archivo, cabecera: notas.cabecera, propios, animaciones };
      }

      servidor.middlewares.use("/api/sprites", async (pedido, respuesta) => {
        const contestar = (codigo, datos) => {
          respuesta.statusCode = codigo;
          respuesta.setHeader("Content-Type", "application/json");
          respuesta.end(JSON.stringify(datos));
        };

        try {
          // GET: todos los dibujos y la paleta común.
          if (pedido.method === "GET") {
            const comun = { ...(await cargar(rutaPaleta)).PALETA };
            delete comun["."];
            const archivos = (await readdir(carpeta))
              .filter((f) => f.endsWith(".js") && f !== "paleta.js")
              .map((f) => f.replace(/\.js$/, ""))
              .sort();
            const dibujos = [];
            const errores = [];
            for (const archivo of archivos) {
              try {
                dibujos.push(await leerDibujo(archivo, comun));
              } catch (error) {
                errores.push(`${archivo}.js: ${error.message}`);
              }
            }
            return contestar(200, { ok: true, comun, dibujos, errores });
          }

          if (pedido.method !== "POST") return contestar(405, { ok: false, error: "Usa GET o POST" });

          // POST: guardar un dibujo (y los colores comunes que cambiaron).
          const { archivo, dibujo, cambiosComun } = JSON.parse(await leerCuerpo(pedido));
          if (typeof archivo !== "string" || !NOMBRE_ARCHIVO.test(archivo) || archivo === "paleta") {
            return contestar(400, { ok: false, error: "Nombre de archivo no válido (solo a-z, 0-9 y _)." });
          }

          let fuentePaleta = await readFile(rutaPaleta, "utf8");
          const comun = { ...(await cargar(rutaPaleta)).PALETA };
          delete comun["."];
          if (cambiosComun && Object.keys(cambiosComun).length > 0) {
            fuentePaleta = cambiarPaletaComun(fuentePaleta, cambiosComun);
            Object.assign(comun, cambiosComun);
          }

          const problemas = revisarDibujo({ ...dibujo, comun });
          if (problemas.length > 0) return contestar(400, { ok: false, error: problemas.join("\n") });

          if (cambiosComun && Object.keys(cambiosComun).length > 0) await writeFile(rutaPaleta, fuentePaleta);
          await writeFile(join(carpeta, `${archivo}.js`), escribirSprite(dibujo));
          contestar(200, { ok: true });
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
      if (cuerpo.length > 2_000_000) fallo(new Error("Dibujo demasiado grande"));
    });
    pedido.on("end", () => listo(cuerpo));
    pedido.on("error", fallo);
  });
}
