const { Intencion }  = require('./model_Intencion');

// Clase Base

class EstrategiaDeProcesamiento {
    constructor(modeloIA, negocio) {
        this.modeloIA = modeloIA;
        this.negocio = negocio;
    }
    procesar(mensaje) {
        return "...";
    }
}

// Clases Especificas

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
