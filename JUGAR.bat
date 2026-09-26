@echo off
REM Doble clic aqui para jugar y programar Caballerito en Windows.
cd /d "%~dp0"
where npm >/dev/null 2>nul
if errorlevel 1 (
  echo Falta instalar Node.js. Descargalo de https://nodejs.org ^(version LTS^) y vuelve a intentar.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Preparando el juego por primera vez...
  call npm install
)
echo Abriendo el juego en el navegador. No cierres esta ventana mientras juegas.
call npm run dev
pause
