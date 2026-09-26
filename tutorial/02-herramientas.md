# 2. Tus herramientas 🧰

## Las tres ventanas del programador

| Ventana | Para qué sirve |
|---|---|
| 📝 **VS Code** (editor de código) | Aquí escribes y cambias el código |
| 🎮 **El navegador** | Aquí juegas y ves tus cambios |
| ⬛ **La terminal** (la ventana negra) | Aquí corre el "servidor" que prepara el juego. ¡No la cierres! |

Pon VS Code a un lado de la pantalla y el navegador al otro.

## Abrir un archivo

En VS Code, a la izquierda, ves las carpetas del juego. Haz clic en
`src` → `config.js`. ¡Ese es el archivo de las **perillas**!

## Guardar = ¡magia!

1. Cambia algo en un archivo.
2. Presiona **Ctrl + S** (en Mac: **Cmd + S**).
3. Mira el navegador: **el juego se actualiza solo**.

> Si el nombre del archivo en la pestaña de arriba tiene un **puntito ●**,
> significa que todavía no guardaste.

## Comentarios: notas para humanos

En el código verás líneas que empiezan con `//`:

```js
export const GRAVEDAD = 1400; // ¿Más grande? Todo cae más rápido.
```

Todo lo que viene después de `//` es un **comentario**. La computadora lo
ignora. Son notas que los programadores dejan para otros humanos (¡y para
ellos mismos del futuro!).

## Cuando algo sale mal: la consola

Si el juego se pone en blanco o algo no funciona:

1. En el navegador presiona **F12**.
2. Haz clic en la pestaña **Console**.
3. Los errores salen en **rojo**. Dicen **qué pasó** y **en qué archivo y línea**.

Ejemplo de error:
```
Uncaught SyntaxError: Unexpected token '}'  (config.js:12)
```
Significa: *"En config.js, línea 12, hay un `}` que no esperaba"*.
Ve a esa línea en VS Code y revisa.

Además, **Vite** (el programa de la ventana negra) muestra muchas veces el
error en grande en el juego mismo, con el archivo y la línea.

> 💡 Los errores más comunes: te faltó una coma `,`, unas comillas `"`,
> o cerrar un paréntesis `)` o una llave `}`.

## Buscar en el código

- **Ctrl + P**: buscar un archivo por su nombre. Escribe "gusano" y aparece `gusano.js`.
- **Ctrl + F**: buscar una palabra dentro del archivo abierto.
- **Ctrl + Shift + F**: buscar una palabra en **todos** los archivos. ¡Muy útil!
  Prueba buscando `"salto"`.

## 🧪 Experimento

1. Abre `src/config.js`.
2. Cambia `VIDAS_MAXIMAS = 5` por `VIDAS_MAXIMAS = 8`. Guarda.
3. ¿Cuántas máscaras ves arriba en el juego?
4. Ahora rompe algo a propósito: borra el `;` del final de una línea y el `=`.
   Guarda. ¿Qué error aparece? Arréglalo con **Ctrl + Z**.

➡️ [Capítulo 3](03-variables.md)
