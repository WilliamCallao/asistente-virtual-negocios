// fabricas.js
const { Intencion } = require('./Intencion');
const {
    EstrategiaConsultaProducto,
    EstrategiaReserva,
    EstrategiaPorDefecto
} = require('./estrategias');

class EstrategiaFactory {
    constructor(cerebroIA, obtenerInformacionNegocio) {
        this.cerebroIA = cerebroIA;
        this.obtenerInformacionNegocio = obtenerInformacionNegocio;
        console.log("FABRICA: EstrategiaFactory inicializada.");
    }

    crearEstrategia(tipoIntencionClave) {
        console.log(` FABRICA: Solicitud para crear estrategia para la intención '${tipoIntencionClave}'`);
        switch (tipoIntencionClave) {
            case Intencion.PRODUCTO:
                console.log("   FABRICA: Creando EstrategiaConsultaProducto.");
                return new EstrategiaConsultaProducto(this.cerebroIA, this.obtenerInformacionNegocio);
            case Intencion.RESERVA:
                console.log("   FABRICA: Creando EstrategiaReserva.");
                return new EstrategiaReserva(this.cerebroIA, this.obtenerInformacionNegocio);
            case Intencion.SALUDO:
            case Intencion.DESCONOCIDO:
            default:
                console.log("   FABRICA: Creando EstrategiaPorDefecto.");
                return new EstrategiaPorDefecto(this.cerebroIA, this.obtenerInformacionNegocio);
        }
    }
}

module.exports = {
    EstrategiaFactory
};