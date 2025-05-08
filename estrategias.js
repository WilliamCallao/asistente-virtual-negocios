// estrategias.js
const { Intencion } = require('./modelos');

class EstrategiaDeProcesamiento {
    constructor(cerebroIA, obtenerInformacionNegocio) {
        if (this.constructor === EstrategiaDeProcesamiento) {
            // Simulación de clase abstracta
        }
        this._cerebroIA = cerebroIA;
        this._obtenerInformacionNegocio = obtenerInformacionNegocio;
    }

    procesar(mensaje) {
        console.error("El método 'procesar' debe ser implementado por la estrategia concreta.");
        return "Error: Estrategia no implementada correctamente.";
    }
}

class EstrategiaConsultaProducto extends EstrategiaDeProcesamiento {
    procesar(mensaje) {
        const pista = this._obtenerInformacionNegocio.obtenerInformacion(Intencion.PREGUNTAR_POR_PRODUCTO);
        const respuestaIA = this._cerebroIA.generarRespuestaIA(mensaje.queDice, pista);
        return `Respuesta sobre productos: (${respuestaIA})`;
    }
}

class EstrategiaReserva extends EstrategiaDeProcesamiento {
    procesar(mensaje) {
        const pista = this._obtenerInformacionNegocio.obtenerInformacion(Intencion.HACER_RESERVA);
        const respuestaIA = this._cerebroIA.generarRespuestaIA(mensaje.queDice, pista);
        return `Respuesta sobre reservas: (${respuestaIA})`;
    }
}

class EstrategiaPorDefecto extends EstrategiaDeProcesamiento {
    procesar(mensaje) {
        const pista = this._obtenerInformacionNegocio.obtenerInformacion(Intencion.NO_SE_ENTIENDE); // Contexto general
        const respuestaIA = this._cerebroIA.generarRespuestaIA(mensaje.queDice, pista);
        return `Respuesta general o de saludo: (${respuestaIA})`;
    }
}

module.exports = {
    EstrategiaDeProcesamiento,
    EstrategiaConsultaProducto,
    EstrategiaReserva,
    EstrategiaPorDefecto
};