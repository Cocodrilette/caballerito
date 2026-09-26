# 9. Git: tu máquina del tiempo ⏳

## ¿Para qué sirve Git?

Imagina que construyes un castillo de LEGO increíble y quieres probar
agregarle una torre gigante... pero te da miedo romperlo. ¿Y si pudieras
**sacarle una foto mágica** y, si la torre sale mal, volver exactamente a la foto?

**Git** hace eso con tu código. Cada "foto" se llama **commit**.

## Los comandos (en la terminal de VS Code)

### 👀 ¿Qué cambié?
```bash
git status
```
Muestra los archivos que cambiaste (en rojo).

```bash
git diff
```
Muestra exactamente qué líneas cambiaste. `-` en rojo = lo que había antes,
`+` en verde = lo nuevo.

### 📸 Sacar una foto (commit)
```bash
git add .
git commit -m "rei salta como canguro"
```
- `git add .` → "prepara todos mis cambios para la foto".
- `git commit -m "..."` → "¡saca la foto!" con un mensaje que diga qué hiciste.

### ⏪ Deshacer lo que no me gustó
```bash
git checkout src/config.js
```
Devuelve **ese archivo** a como estaba en la última foto.

```bash
git checkout .
```
Devuelve **todos** los archivos a la última foto. ⚠️ Lo que no guardaste en un commit se pierde.

### 📜 Ver todas mis fotos
```bash
git log --oneline
```

### ☁️ Subir a internet (GitHub)
```bash
git push
```
Guarda una copia de todas tus fotos en GitHub. ¡Así no se pierden nunca!

## La rutina del programador

1. 🎮 Juega y piensa qué quieres cambiar.
2. ✏️ Cambia el código.
3. 💾 Guarda y prueba.
4. ¿Funciona? → 📸 `git add .` y `git commit -m "lo que hice"`.
5. ¿Se rompió? → ⏪ Ctrl + Z o `git checkout .` y vuelve a intentar.
6. Al final del día → ☁️ `git push`.

## 🏆 Reto de Git

Después de cada reto de [retos.md](retos.md), haz un commit con el número:

```bash
git add .
git commit -m "reto 3: vidas extra"
```

Con `git log --oneline` verás tu colección de logros. 🏅

➡️ ¡Ahora sí! Ve a los [RETOS](retos.md) 🚀
