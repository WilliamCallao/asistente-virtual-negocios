// main.js

const { Mensaje } = require('./Mensaje');
const { Intencion } = require('./Intencion');
const EmisorWhatsapp = require('./EmisorWhatsapp');
const ModeloIA = require('./ModeloIA');
const Negocio = require('./Negocio');
const DetectorDeIntenciones = require('./DetectorDeIntenciones');
const { ModeloIAExtendido } = require('./ModeloIAExtendido');
const crearEstrategia = require('./estrategiaFactory');
const { AsistenteVirtual } = require('./asistente');

console.log("--- MAIN: Iniciando configuración del Asistente Virtual ---");

// 1. Componentes base
const miEnviadorConsola = new EmisorWhatsapp();
const miobtenerInformacionNegocio = new Negocio();
const miDetectorIntenciones = new DetectorDeIntenciones(Intencion);

// 2. Motor de IA y Decorador
const motorIAReal = new ModeloIA();
console.log("MAIN: Envolviendo Motor de IA con Decorador de Logging...");
const motorIAConLogging = new ModeloIAExtendido(motorIAReal);


// 4. Mapa de Estrategias (usando la fábrica)
console.log("MAIN: Creando mapa de estrategias específicas...");
const mapaEstrategias = {
    [Intencion.PRODUCTO]: crearEstrategia(Intencion.PRODUCTO, motorIAConLogging, miobtenerInformacionNegocio),
    [Intencion.RESERVA]: crearEstrategia(Intencion.RESERVA, motorIAConLogging, miobtenerInformacionNegocio),
};
const estrategiaPorDefecto = crearEstrategia(Intencion.DESCONOCIDO, motorIAConLogging, miobtenerInformacionNegocio);


// 6. Asistente Virtual
console.log("MAIN: Creando Asistente Virtual...");
const asistente = new AsistenteVirtual(
    miDetectorIntenciones,
    miEnviadorConsola,
    mapaEstrategias,
    estrategiaPorDefecto
);

console.log("\n--- MAIN: Iniciando simulación de mensajes ---");
asistente.atenderNuevoMensaje(new Mensaje("UsuarioAlfa", "Hola, ¿qué tal?"));
asistente.atenderNuevoMensaje(new Mensaje("UsuarioBeta", "Quiero saber el precio del producto X"));
asistente.atenderNuevoMensaje(new Mensaje("UsuarioGamma", "Necesito hacer una reserva para mañana"));
asistente.atenderNuevoMensaje(new Mensaje("UsuarioDelta", "¿Venden bicicletas?")); // Debería caer en producto
asistente.atenderNuevoMensaje(new Mensaje("UsuarioEpsilon", "blablabla")); // Debería caer en no entendido
console.log("\n--- MAIN: Simulación terminada ---");