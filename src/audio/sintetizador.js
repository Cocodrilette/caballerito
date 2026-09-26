// SINTETIZADOR
// Aquí nacen todos los sonidos del juego. No usamos archivos de sonido:
// fabricamos cada nota con osciladores (ondas) y ruido, como las
// consolas antiguas. ¡Por eso se llama música "chiptune"!
//
// Ondas que puedes usar:
//   "sine"     -> suave y redonda, como silbar
//   "triangle" -> suave pero más clara, como una flauta
//   "square"   -> la clásica de videojuego, ¡bip bip!
//   "sawtooth" -> áspera y fuerte, como un zumbido

// Volumen de TODO el juego (0 = nada, 1 = muy fuerte).
const VOLUMEN_MAESTRO = 0.55;

// El eco de la cueva: cuánto tarda en volver el sonido (en segundos)
// y cuánto se repite (0 = nada, 0.7 = mucho).
const ECO_TIEMPO = 0.31;
const ECO_REPETIR = 0.38;

// ---------- Notas en texto -> frecuencias ----------

// Cuántos pasos (semitonos) hay desde C (Do) hasta cada nota.
const POSICION = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// Convierte "A4" en 440, "C4" en 261.6, "D#3" o "Bb2" en su número.
// Si ya le das un número, lo deja igual. Si no entiende, da null.
export function notaAFrecuencia(nota) {
  if (typeof nota === "number") return nota;
  const partes = /^([A-Ga-g])([#b]?)(\d)$/.exec(String(nota).trim());
  if (!partes) return null;

  let semitono = POSICION[partes[1].toUpperCase()];
  if (partes[2] === "#") semitono += 1; // sostenido: un poquito más agudo
  if (partes[2] === "b") semitono -= 1; // bemol: un poquito más grave
  const octava = Number(partes[3]);

  // La nota A4 (La) vibra 440 veces por segundo. Cada octava dobla eso.
  const numero = (octava + 1) * 12 + semitono;
  return 440 * Math.pow(2, (numero - 69) / 12);
}

// ---------- El sintetizador ----------

// Crea un sintetizador que toca en un contexto de audio.
// (Sirve con AudioContext normal y también con OfflineAudioContext.)
export function crearSintetizador(ctx) {
  // Todo pasa por el "maestro" y luego por un compresor que evita
  // que el sonido se rompa si suenan muchas cosas a la vez.
  const maestro = ctx.createGain();
  maestro.gain.value = VOLUMEN_MAESTRO;
  const compresor = ctx.createDynamicsCompressor();
  compresor.threshold.value = -12;
  compresor.knee.value = 6;
  compresor.ratio.value = 8;
  compresor.attack.value = 0.003;
  compresor.release.value = 0.2;
  maestro.connect(compresor);
  compresor.connect(ctx.destination);

  // El eco de cueva: el sonido rebota, se oscurece y vuelve.
  const eco = ctx.createGain();
  const retrasoCorto = ctx.createDelay(1);
  const retrasoLargo = ctx.createDelay(1);
  retrasoCorto.delayTime.value = ECO_TIEMPO;
  retrasoLargo.delayTime.value = ECO_TIEMPO * 1.53;
  const oscurecer = ctx.createBiquadFilter();
  oscurecer.type = "lowpass";
  oscurecer.frequency.value = 1800;
  const repetir = ctx.createGain();
  repetir.gain.value = ECO_REPETIR;
  const volumenEco = ctx.createGain();
  volumenEco.gain.value = 0.5;

  eco.connect(retrasoCorto);
  eco.connect(retrasoLargo);
  retrasoCorto.connect(oscurecer);
  retrasoLargo.connect(oscurecer);
  oscurecer.connect(repetir);
  repetir.connect(retrasoCorto); // el eco vuelve a entrar: se repite
  oscurecer.connect(volumenEco);
  volumenEco.connect(maestro);

  // Un pedacito de ruido (como la tele sin señal) para tambores y golpes.
  const ruido = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const datos = ruido.getChannelData(0);
  for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1;

  // Una "salida" es un volumen propio (para la música o los efectos).
  // Así podemos bajar una canción sin tocar lo demás.
  function crearSalida(volumen = 1) {
    const seco = ctx.createGain();
    const conEco = ctx.createGain();
    seco.gain.value = volumen;
    conEco.gain.value = volumen;
    seco.connect(maestro);
    conEco.connect(eco);

    return {
      seco,
      eco: conEco,
      // Cambia el volumen poco a poco (fundido) en "segundos".
      fundir(destino, segundos) {
        const ahora = ctx.currentTime;
        for (const nodo of [seco, conEco]) {
          nodo.gain.cancelScheduledValues(ahora);
          nodo.gain.setValueAtTime(nodo.gain.value, ahora);
          nodo.gain.linearRampToValueAtTime(destino, ahora + segundos);
        }
      },
      desconectar() {
        seco.disconnect();
        conEco.disconnect();
      },
    };
  }

  // Manda un sonido a la salida, con un poquito de eco si se pide.
  function conectar(nodo, salida, cantidadEco) {
    nodo.connect(salida.seco);
    if (cantidadEco > 0) {
      const envio = ctx.createGain();
      envio.gain.value = cantidadEco;
      nodo.connect(envio);
      envio.connect(salida.eco);
    }
  }

  // Toca UNA nota con un instrumento (ver instrumentos.js).
  // La envolvente ADSR dice cómo cambia el volumen de la nota:
  //   ataque   -> cuánto tarda en llegar a lo más fuerte
  //   decaer   -> cuánto tarda en bajar hasta "sostener"
  //   sostener -> qué tan fuerte se queda mientras dura (0 a 1)
  //   soltar   -> cuánto tarda en apagarse al terminar
  function tocarNota(instrumento, frecuencia, tiempo, duracion, salida) {
    const ataque = instrumento.ataque ?? 0.01;
    const decaer = instrumento.decaer ?? 0.2;
    const sostener = instrumento.sostener ?? 0.5;
    const soltar = instrumento.soltar ?? 0.2;
    const volumen = instrumento.volumen ?? 0.2;

    const envolvente = ctx.createGain();
    const g = envolvente.gain;
    const fin = tiempo + Math.max(duracion, ataque);
    g.setValueAtTime(0, tiempo);
    g.linearRampToValueAtTime(volumen, tiempo + ataque);
    g.setTargetAtTime(volumen * sostener, tiempo + ataque, Math.max(decaer / 3, 0.001));
    g.setTargetAtTime(0, fin, Math.max(soltar / 4, 0.001));
    const apagar = fin + soltar + 0.05;

    // Un filtro opcional quita los sonidos muy agudos (más suave).
    let entrada = envolvente;
    if (instrumento.filtro) {
      const filtro = ctx.createBiquadFilter();
      filtro.type = "lowpass";
      filtro.frequency.value = instrumento.filtro;
      filtro.connect(envolvente);
      entrada = filtro;
    }

    // Vibrato: la nota tiembla un poquito, como una voz.
    let temblor = null;
    if (instrumento.vibrato) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = instrumento.vibrato.velocidad ?? 5;
      temblor = ctx.createGain();
      temblor.gain.value = instrumento.vibrato.cantidad ?? 10; // en "cents"
      lfo.connect(temblor);
      lfo.start(tiempo);
      lfo.stop(apagar);
    }

    function oscilador(onda, frec, volumenRelativo, desafinar) {
      const osc = ctx.createOscillator();
      osc.type = onda;
      osc.frequency.value = frec;
      osc.detune.value = desafinar;
      if (temblor) temblor.connect(osc.detune);
      const nivel = ctx.createGain();
      nivel.gain.value = volumenRelativo;
      osc.connect(nivel);
      nivel.connect(entrada);
      osc.start(tiempo);
      osc.stop(apagar);
    }

    const onda = instrumento.onda ?? "square";
    if (instrumento.desafinar) {
      // Dos osciladores un poco desafinados suenan más "gordos".
      oscilador(onda, frecuencia, 0.5, instrumento.desafinar);
      oscilador(onda, frecuencia, 0.5, -instrumento.desafinar);
    } else {
      oscilador(onda, frecuencia, 1, 0);
    }
    if (instrumento.armonico) {
      // Un segundo tono más agudo: así suenan las campanas.
      const a = instrumento.armonico;
      oscilador(a.onda ?? "sine", frecuencia * a.multiplicar, a.volumen ?? 0.3, 0);
    }

    conectar(envolvente, salida, instrumento.eco ?? 0);
  }

  // Toca un EFECTO (ver efectos.js). Puede ser un objeto o una lista
  // de objetos; cada uno puede esperar un "retraso" antes de sonar.
  function tocarSonido(sonido, tiempo, salida) {
    const lista = Array.isArray(sonido) ? sonido : [sonido];
    for (const parte of lista) {
      tocarParte(parte, tiempo + (parte.retraso ?? 0), salida);
    }
  }

  function tocarParte(p, tiempo, salida) {
    const duracion = p.duracion ?? 0.2;
    const volumen = p.volumen ?? 0.2;
    const cantidadRuido = Math.min(Math.max(p.ruido ?? 0, 0), 1);
    const desde = Math.max(notaAFrecuencia(p.frecuenciaInicial ?? 440) ?? 440, 20);
    const hasta = Math.max(notaAFrecuencia(p.frecuenciaFinal ?? desde) ?? desde, 20);
    const fin = tiempo + duracion;

    // El volumen sube rapidito y luego se apaga.
    const envolvente = ctx.createGain();
    envolvente.gain.setValueAtTime(0, tiempo);
    envolvente.gain.linearRampToValueAtTime(volumen, tiempo + (p.ataque ?? 0.005));
    envolvente.gain.exponentialRampToValueAtTime(0.0001, fin);

    // El tono: una onda que va de "frecuenciaInicial" a "frecuenciaFinal".
    if (cantidadRuido < 1) {
      const osc = ctx.createOscillator();
      osc.type = p.onda ?? "square";
      osc.frequency.setValueAtTime(desde, tiempo);
      osc.frequency.exponentialRampToValueAtTime(hasta, fin);
      const nivel = ctx.createGain();
      nivel.gain.value = 1 - cantidadRuido;
      osc.connect(nivel);
      nivel.connect(envolvente);
      osc.start(tiempo);
      osc.stop(fin + 0.05);
    }

    // El ruido: ¡shhh! Lo filtramos para que siga el mismo camino del tono.
    if (cantidadRuido > 0) {
      const fuente = ctx.createBufferSource();
      fuente.buffer = ruido;
      fuente.loop = true;
      const filtro = ctx.createBiquadFilter();
      filtro.type = "bandpass";
      filtro.Q.value = 0.8;
      filtro.frequency.setValueAtTime(desde, tiempo);
      filtro.frequency.exponentialRampToValueAtTime(hasta, fin);
      const nivel = ctx.createGain();
      nivel.gain.value = cantidadRuido * 2; // el filtro le quita fuerza
      fuente.connect(filtro);
      filtro.connect(nivel);
      nivel.connect(envolvente);
      fuente.start(tiempo, Math.random() * 1.5);
      fuente.stop(fin + 0.05);
    }

    conectar(envolvente, salida, p.eco ?? 0);
  }

  // true = mudo, false = con sonido.
  function silenciar(mudo) {
    const ahora = ctx.currentTime;
    maestro.gain.cancelScheduledValues(ahora);
    maestro.gain.setValueAtTime(maestro.gain.value, ahora);
    maestro.gain.linearRampToValueAtTime(mudo ? 0 : VOLUMEN_MAESTRO, ahora + 0.05);
  }

  return { ctx, crearSalida, tocarNota, tocarSonido, silenciar };
}
