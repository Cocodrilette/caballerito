// PERILLAS DEL JUEGO
// Aquí están todos los números importantes. ¡Cámbialos y mira qué pasa!
// Consejo: cambia un solo número, guarda, y prueba el juego.

// --- El mundo ---
export const TAMAÑO_BLOQUE = 16; // cada bloque mide 16 x 16 píxeles
export const ANCHO_PANTALLA = 480;
export const ALTO_PANTALLA = 270;
export const GRAVEDAD = 1400; // ¿Más grande? Todo cae más rápido. ¿Pequeño? ¡Como en la Luna!
export const VELOCIDAD_MAXIMA_CAIDA = 520; // lo más rápido que puedes caer

// --- El caballerito ---
export const VELOCIDAD = 120; // qué tan rápido corre
export const FUERZA_SALTO = 450; // qué tan alto salta (¡más de 4 bloques!)
export const FRENO_SALTO = 0.4; // si sueltas saltar antes, el salto se corta (0 = corta todo, 1 = nada)
export const TIEMPO_COYOTE = 0.1; // segundos para saltar aunque ya te saliste del borde
export const TIEMPO_RECUERDO_SALTO = 0.1; // si presionas saltar justo antes de tocar el suelo, igual salta
export const VIDAS_MAXIMAS = 5; // cuántas máscaras tienes

// --- El aguijón (tu espada) ---
export const DAÑO_AGUIJON = 1; // cuánta vida le quitas a un enemigo por golpe
export const TIEMPO_ATAQUE = 0.22; // cuánto dura el tajo en pantalla
export const RECARGA_ATAQUE = 0.28; // cuánto esperar entre tajos
export const RETROCESO_GOLPE = 140; // cuánto te empuja hacia atrás cuando pegas
export const FUERZA_POGO = 380; // qué tan alto rebotas al pegar hacia abajo

// --- El dash (carrerita súper rápida) ---
export const VELOCIDAD_DASH = 300;
export const DURACION_DASH = 0.16;
export const RECARGA_DASH = 0.5;

// --- Cuando te hacen daño ---
export const TIEMPO_INVULNERABLE = 1.2; // segundos que parpadeas y nada te lastima
export const TIEMPO_ATURDIDO = 0.25; // segundos en que no puedes moverte tras un golpe
export const EMPUJON_DAÑO = 180; // qué tan lejos te lanza un golpe
export const TIEMPO_REAPARECER = 1.5; // segundos antes de volver a la banca al perder

// --- Enemigos ---
export const GUSANO_VELOCIDAD = 30;
export const GUSANO_VIDA = 2;
export const MOSQUITO_VELOCIDAD = 55;
export const MOSQUITO_VIDA = 2;
export const MOSQUITO_DISTANCIA_VISTA = 110; // desde qué tan lejos te ve
export const EMPUJON_ENEMIGO = 160; // cuánto retrocede un enemigo cuando le pegas
export const GEO_POR_ENEMIGO = 3; // monedas que suelta al caer

// --- El jefe: Gran Escarabajo ---
export const JEFE_VIDA = 16;
export const JEFE_VELOCIDAD_EMBESTIDA = 190;
export const JEFE_FUERZA_SALTO = 480;
export const JEFE_TIEMPO_PAUSA = 1.4; // cuánto descansa (¡aprovecha para pegarle!)
export const JEFE_DISTANCIA_DESPERTAR = 150;
export const GEO_JEFE = 25;

// --- La cámara y el fondo ---
export const SUAVIDAD_CAMARA = 6; // más grande = la cámara te sigue más pegadita
export const CANTIDAD_POLVO = 28; // partículas brillantes flotando

// --- Los botones ---
// Puedes agregar más teclas a cada acción.
export const BOTONES = {
  izquierda: { keyboard: ["left", "a"], gamepad: ["dpad-left"] },
  derecha: { keyboard: ["right", "d"], gamepad: ["dpad-right"] },
  arriba: { keyboard: ["up", "w"], gamepad: ["dpad-up"] },
  abajo: { keyboard: ["down", "s"], gamepad: ["dpad-down"] },
  saltar: { keyboard: ["z", "j", "space"], gamepad: ["south"] },
  atacar: { keyboard: ["x", "k"], gamepad: ["west"] },
  dash: { keyboard: ["c", "l"], gamepad: ["east", "rshoulder"] },
  pausa: { keyboard: ["escape", "p"], gamepad: ["start"] },
};

// --- Tamaños de letra ---
// Nuestra letra de píxeles mide 9 de alto: usa 9, 18, 27 o 36
// para que cada píxel crezca igual y se lea nítido.
export const LETRA_CHICA = 9;
export const LETRA_MEDIANA = 18;
export const LETRA_GRANDE = 36;

// --- ¿Con quién juegas? ---
// Prueba con "rei". (En la pantalla de título también puedes elegir con ← →)
export const PERSONAJE = "caballero";

// --- Partida guardada ---
// true = al descansar en una banca o pasar una puerta, el juego recuerda
// dónde ibas (aunque cierres la página). false = siempre empiezas de cero.
export const GUARDAR_PARTIDA = true;
