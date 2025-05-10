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
const iaSimple = new IA();
const iaRegistro = new IAConRegistro(iaSimple);
const mapaEstrategias = {
    [Intencion.PRODUCTO]: crearEstrategia(Intencion.PRODUCTO, iaRegistro, negocio),
    [Intencion.RESERVA]: crearEstrategia(Intencion.RESERVA, iaRegistro, negocio),
    [Intencion.DESCONOCIDO]: crearEstrategia(Intencion.DESCONOCIDO, iaRegistro, negocio),
};


const asistente = new AsistenteVirtual(
    detectorIntenciones,
    canalRespuesta,
    mapaEstrategias,
);

asistente.atenderNuevoMensaje(new Mensaje("Usuario 1", "Quiero saber el precio del producto X"));
asistente.atenderNuevoMensaje(new Mensaje("Usuario 2", "Necesito hacer una reserva para mañana"));
asistente.atenderNuevoMensaje(new Mensaje("Usuario 3", "blablabla"));