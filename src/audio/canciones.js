// LISTA DE CANCIONES
// Busca solita todas las canciones de la carpeta src/musica/.
// Si creas una canción nueva allí, ¡aparece aquí sin hacer nada más!

const archivos = import.meta.glob("../musica/*.js", { eager: true });

export const canciones = {};
for (const archivo of Object.values(archivos)) {
  const cancion = archivo.default;
  if (cancion && cancion.nombre) canciones[cancion.nombre] = cancion;
}
