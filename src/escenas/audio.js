// El navegador no deja sonar nada hasta que tocas una tecla.
// Esta función despierta el audio una sola vez.
import { iniciarAudio } from "../audio/sonido.js";

let audioDespierto = false;

export function despertarAudio() {
  if (audioDespierto) return;
  iniciarAudio();
  audioDespierto = true;
}

export function audioEstaDespierto() {
  return audioDespierto;
}
