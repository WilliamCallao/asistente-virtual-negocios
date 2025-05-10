const { Mensaje } = require('./model_mensaje');
const { Intencion } = require('./model_Intencion');
const Whatsapp = require('./Whatsapp');
const Negocio = require('./model_negocio');
const DetectorDeIntenciones = require('./IA_Clasificador');
const { IA, IAConRegistro } = require('./IA');
const crearEstrategia = require('./estrategiaFactory');
const { AsistenteVirtual } = require('./asistente');


const canalRespuesta = new Whatsapp();
const negocio = new Negocio();
const detectorIntenciones = new DetectorDeIntenciones(Intencion);
const motorIAReal = new IA();
const ia = new IAConRegistro(motorIAReal);
const mapaEstrategias = {
    [Intencion.PRODUCTO]: crearEstrategia(Intencion.PRODUCTO, ia, negocio),
    [Intencion.RESERVA]: crearEstrategia(Intencion.RESERVA, ia, negocio),
    [Intencion.DESCONOCIDO]: crearEstrategia(Intencion.DESCONOCIDO, ia, negocio),
};


const asistente = new AsistenteVirtual(
    detectorIntenciones,
    canalRespuesta,
    mapaEstrategias,
);

asistente.atenderNuevoMensaje(new Mensaje("Usuario 1", "Quiero saber el precio del producto X"));
asistente.atenderNuevoMensaje(new Mensaje("Usuario 2", "Necesito hacer una reserva para mañana"));
asistente.atenderNuevoMensaje(new Mensaje("Usuario 3", "blablabla"));