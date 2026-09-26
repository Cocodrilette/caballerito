# 🗡️ Guía de Caballerito: ¡cambia tu propio juego!

Este juego está hecho con **código**. El código son instrucciones que le
damos a la computadora. Y como tú puedes cambiar las instrucciones...
**¡tú puedes cambiar el juego!**

---

## 🚀 Cómo abrir el juego

**En Windows:** doble clic en `JUGAR.bat`.
**En Mac:** abre la Terminal en esta carpeta y escribe `npm run dev`.

Se abre el navegador con el juego. **No cierres la ventana negra** mientras juegas.

- El juego: `http://localhost:5173/`
- El taller de niveles: `http://localhost:5173/editor.html`

> La primera vez hay que instalar **Node.js** desde https://nodejs.org (versión LTS).

### Controles

| Tecla | Qué hace |
|---|---|
| ← → | Correr |
| Z o Espacio | Saltar (mantén para saltar más alto) |
| X | Atacar con el aguijón (con ↑ pega arriba) |
| ↓ + X en el aire | ¡Pogo! Rebota sobre enemigos y pinchos |
| C | Dash (carrerita súper rápida) |
| ↑ en una banca | Descansar y **guardar la partida** |
| Escape | Pausa |

---

## 🌟 Misión 1: Salta como en la Luna

1. Abre el archivo `src/config.js`.
2. Busca esta línea:
   ```js
   export const GRAVEDAD = 1400;
   ```
3. Cambia `1400` por `400`.
4. Guarda el archivo (**Ctrl + S**).
5. Mira el juego... ¡ya cambió! 🌙

**¿Qué pasó?** La gravedad es lo que te jala hacia abajo. Con menos gravedad, ¡flotas!

Prueba también:
- `VELOCIDAD = 300` → ¡corres rapidísimo!
- `VIDAS_MAXIMAS = 10` → tienes 10 máscaras.
- `JEFE_VIDA = 3` → el jefe es facilito.

## 🐶 Misión 2: Juega con Rei

En `src/config.js` busca:
```js
export const PERSONAJE = "caballero";
```
Cámbialo por `"rei"`. (También puedes elegir en la pantalla de inicio con ← →).

## 🗺️ Misión 3: Dibuja tu propio nivel

1. Abre el **Taller de Niveles** (`editor.html`).
2. Elige una cosa a la izquierda (suelo, pinchos, gusano...) y pinta con el mouse.
3. No olvides poner al jugador **@** y una puerta **>**.
4. Presiona **▶ ¡JUGAR!** para probarlo.
5. ¿Te gustó? Presiona **💾 Guardar en el juego**.

**Secreto:** presiona **📝 Ver como texto**. ¡Tu nivel son solo letras!
```
=   @      $$$     >
=  ----   g   ^^^  >
====================
```
Cada letra es una cosa. Mira la lista completa en `src/leyenda.js`.

## 🎨 Misión 4: Pinta un personaje

Abre `src/sprites/moneda.js`. Los dibujos son letras: **cada letra es un píxel**
y cada letra tiene un color en la `paleta`. Cambia algunas letras, guarda y mira.

Para ver todos los dibujos en grande: `http://localhost:5173/herramientas/ver-sprites.html`

⚠️ Todas las filas de un dibujo deben tener **el mismo largo**. Si te equivocas,
el juego te dice en qué fila está el problema. ¡No pasa nada, lo arreglas y listo!

## 🎵 Misión 5: Compón una canción

Abre `src/musica/cueva.js`. Las canciones son notas escritas:
`C4 D4 E4` = do re mi. Un `-` hace que la nota dure más. Un `.` es silencio.

Para escuchar todas las canciones y sonidos: `http://localhost:5173/herramientas/probar-sonidos.html`

Lee `src/musica/LEEME.md` para más secretos musicales.

## 🔊 Misión 6: Cambia un sonido

En `src/audio/efectos.js` está el sonido del salto:
```js
salto: {
  onda: "square", frecuenciaInicial: 260, frecuenciaFinal: 620,
  duracion: 0.14, volumen: 0.19,
},
```
Cambia `620` por `1500`. ¿Cómo suena ahora? ¿Y si pones `frecuenciaFinal: 100`?

---

## 🧭 Mapa del código (para cuando quieras ir más lejos)

| Archivo / carpeta | Qué hay adentro |
|---|---|
| `src/config.js` | **Las perillas.** ¡Empieza aquí! |
| `src/leyenda.js` | Qué significa cada letra de los niveles |
| `niveles/` | Los niveles (archivos `.json`) |
| `src/jugador.js` | El personaje que controlas |
| `src/habilidades/` | Saltar, atacar, dash (un archivo cada una) |
| `src/enemigos/` | Gusano, mosquito y el jefe |
| `src/sprites/` | Todos los dibujos, hechos con letras |
| `src/musica/` | Las canciones, escritas con notas |
| `src/audio/efectos.js` | Los efectos de sonido |
| `src/escenas/` | Las pantallas: inicio, juego, pausa, victoria |
| `src/guardado.js` | Cómo se guarda tu partida |
| `editor.html`, `src/editor/` | El Taller de Niveles |
| `CONTRATOS.md` | Las reglas que usan todas las partes para entenderse |

### 💡 Ideas para el futuro
- Un enemigo nuevo: copia `src/enemigos/gusano.js`, cámbiale el nombre, dibuja su sprite y agrega una letra en `src/leyenda.js`.
- Que Rei tenga un ataque diferente al caballerito.
- Un nivel secreto detrás de una pared.
- Una canción para la pantalla de victoria.

**Regla de oro:** cambia una cosa, guarda y prueba. Si algo se rompe,
**deshaz** tu cambio (Ctrl + Z) y vuelve a intentar. ¡Así aprenden todos los programadores! 💪
