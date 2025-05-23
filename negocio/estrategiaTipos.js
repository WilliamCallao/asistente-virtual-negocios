// PATRÓN STRATEGY
//
// Este archivo define las diferentes "estrategias" para procesar mensajes.
// - `EstrategiaDeProcesamiento`: Es la interfaz base para cada estrategia.
// - `EstrategiaConsultaProducto`, `EstrategiaReserva`, `EstrategiaPorDefecto`: Son las
//    implementaciones concretas, cada una con una lógica de procesamiento específica.
// Esto permite que el `AsistenteVirtual` elija y utilice la estrategia adecuada
// sin conocer los detalles de su implementación, facilitando la extensibilidad.

const { Intencion } = require('./models/model_Intencion');

class EstrategiaDeProcesamiento {
    constructor(modeloIA, negocio) {
        this.modeloIA = modeloIA;
        this.negocio = negocio;
    }
    procesar(mensaje) {
        return "...";
    }
}

class EstrategiaConsultaProducto extends EstrategiaDeProcesamiento {
    procesar(mensaje) {
        const contexto = this.negocio.obtenerInformacion(Intencion.PRODUCTO);
        const respuesta = this.modeloIA.generarRespuestaIA(mensaje.texto, contexto);
        return respuesta;
    }
}

class EstrategiaReserva extends EstrategiaDeProcesamiento {
    procesar(mensaje) {
        const contexto = this.negocio.obtenerInformacion(Intencion.RESERVA);
        const respuesta = this.modeloIA.generarRespuestaIA(mensaje.texto, contexto);
        return respuesta;
    }
}

class EstrategiaPorDefecto extends EstrategiaDeProcesamiento {
    procesar(mensaje) {
        const contexto = this.negocio.obtenerInformacion(Intencion.DESCONOCIDO);
        const respuesta = this.modeloIA.generarRespuestaIA(mensaje.texto, contexto);
        return respuesta;
    }
}

module.exports = {
    EstrategiaDeProcesamiento,
    EstrategiaConsultaProducto,
    EstrategiaReserva,
    EstrategiaPorDefecto
};
