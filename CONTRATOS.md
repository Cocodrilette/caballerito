# Contratos entre las partes del juego

Este archivo define cómo se comunican las piezas del juego. Si cambias un
nombre aquí, cámbialo también en el código que lo usa.

Reglas generales:
- JavaScript moderno (ES modules), **sin TypeScript**.
- Kaplay en **modo global** (`add`, `pos`, `sprite`... están disponibles en todas partes
  después de llamar `kaplay()` en `src/main.js`).
- Nombres que un niño va a tocar: **en español** (`jugador`, `saltar`, `VELOCIDAD`).
  Comentarios en español, cortos y amables.
- Tamaño de un bloque (tile): **16 × 16 píxeles**. Pantalla del juego: **480 × 270**.

---

## 1. Sprites (`src/sprites/`) — dueño: agente de Arte

Cada sprite es un archivo `src/sprites/<nombre>.js` que exporta por defecto:

```js
export default {
  nombre: "gusano",
  paleta: { ".": null, "K": "#0a0a12", "W": "#f2f2f2" }, // null = transparente
  animaciones: {
    caminar: { velocidad: 6, repetir: true, cuadros: [
      [ // cuadro 1: cada string es una fila, cada letra un píxel
        "....KKKK....",
        "...KWWWWK...",
      ],
      [ /* cuadro 2 */ ],
    ]},
  },
};
```

`src/motor/cargarSprites.js` exporta `cargarSprites()` (async): lee todos los
sprites y llama `loadSprite(nombre, ..., { sliceX, anims })` de Kaplay. La
primera animación listada es la que se usa por defecto.

### Lista obligatoria de sprites (nombre → animaciones, tamaño en px)

| nombre | animaciones | tamaño |
|---|---|---|
| `caballero` | `quieto`(2), `correr`(4), `saltar`(1), `caer`(1), `atacar`(2), `dash`(1), `herido`(1) | 16×24 |
| `tajo` | `tajo`(3) — arco del aguijón, apuntando a la DERECHA | 24×16 |
| `gusano` | `caminar`(2) | 16×12 |
| `mosquito` | `volar`(2) | 14×12 |
| `jefe` | `quieto`(2), `embestir`(2), `herido`(1) | 40×32 |
| `suelo` | `normal`(1) — roca de cueva | 16×16 |
| `suelo_borde` | `normal`(1) — roca con borde superior (musgo/brillo) | 16×16 |
| `plataforma` | `normal`(1) — plataforma delgada (dibujada en los 5 px de arriba) | 16×16 |
| `pinchos` | `normal`(1) | 16×16 |
| `banca` | `normal`(1) — banca de descanso / guardado | 32×16 |
| `moneda` | `girar`(4) — "geo" | 10×10 |
| `escupidor` | `quieto`(2), `escupir`(2) — mirando a la DERECHA | 16×14 |
| `bolita` | `normal`(2) — lo que escupe el escupidor | 6×6 |
| `puerta` | `normal`(1) — salida al siguiente nivel | 16×32 |
| `cristal` | `brillar`(2) — decoración | 16×16 |
| `hongo` | `normal`(1) — decoración | 16×16 |
| `mascara_llena` | `normal`(1) — vida en el HUD | 12×14 |
| `mascara_vacia` | `normal`(1) | 12×14 |
| `icono_geo` | `normal`(1) — icono del HUD | 10×10 |
| `particula` | `normal`(1) — chispa blanca pequeña | 4×4 |

Todos los cuadros de un mismo sprite tienen el mismo tamaño.

---

## 2. Sonido (`src/audio/`, `src/musica/`) — dueño: agente de Audio

`src/audio/sonido.js` exporta:

```js
iniciarAudio()        // llamar tras la primera tecla/clic (política del navegador)
tocarMusica(nombre)   // "menu" | "cueva" | "jefe"   (si ya suena esa, no hace nada)
pararMusica()
efecto(nombre)        // ver lista abajo
silenciar(bool)       // true = mudo
```

Efectos: `salto`, `tajo`, `golpe` (aguijón pega a enemigo), `herido` (jugador
recibe daño), `moneda`, `dash`, `banca`, `muerte`, `jefe_golpe`, `puerta`, `pogo`.

Las canciones viven en `src/musica/<nombre>.js` escritas como notas en texto.

---

## 3. Niveles (`niveles/*.json`) — formato compartido por Juego y Editor

```json
{
  "nombre": "Cueva de los Susurros",
  "musica": "cueva",
  "fondo": "#0b1020",
  "siguiente": "nivel2",
  "consejo": "Flechas para correr, Z para saltar",
  "mapa": [
    "==============================",
    "=                            =",
    "=   @        $$$      m      =",
    "=  -----         ---         >",
    "=        g     ^^^     B     >",
    "=============================="
  ]
}
```

- `consejo` (opcional): texto corto que aparece debajo del nombre al entrar al nivel.
- `siguiente`: nombre del archivo (sin `.json`) al que lleva la puerta `>`. Si falta, se gana el juego.
- Todas las filas de `mapa` deben tener el mismo largo.
- La lista de niveles en orden está en `niveles/indice.json`: `{ "niveles": ["nivel1", "nivel2", ...] }`.

### Leyenda de símbolos
Definida en `src/leyenda.js` (la usan el juego y el editor). No inventes
símbolos sin agregarlos allí.

### Probar un nivel desde el editor
El editor guarda el nivel en `localStorage["editor:nivelPrueba"]` (JSON string)
y abre `index.html?prueba=1`. El juego, si ve `?prueba=1`, carga ese nivel en
lugar del nivel 1. Con `?nivel=nivel2` carga un nivel específico.
