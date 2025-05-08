
// asistente.js
// const { TipoDeIntencion } = require('./modelos'); // No es necesario aquí si la lógica de selección es simple

class AsistenteVirtual {
    constructor(detectorInt, enviadorResp, mapaDeEstrategias, estrategiaPorDefecto) {
        this._detectorIntenciones = detectorInt;
        this._enviadorRespuestas = enviadorResp;
        this._mapaDeEstrategias = mapaDeEstrategias;
        this._estrategiaPorDefecto = estrategiaPorDefecto;
        console.log("ASISTENTE: AsistenteVirtual inicializado.");
    }

    atenderNuevoMensaje(mensaje) {
        console.log(`\nASISTENTE: Nuevo mensaje de: ${mensaje.remitente} - "${mensaje.texti}"`);

        const intencionDetectada = this._detectorIntenciones.detectar(mensaje.texto);

        let estrategiaSeleccionada = this._mapaDeEstrategias[intencionDetectada];

        if (!estrategiaSeleccionada) {
            console.log(` ASISTENTE: No hay estrategia mapeada para '${intencionDetectada}', usando estrategia por defecto.`);
            estrategiaSeleccionada = this._estrategiaPorDefecto;
        } else {
            console.log(` ASISTENTE: Estrategia mapeada encontrada para '${intencionDetectada}'.`);
        }

        console.log(` - Usando estrategia: ${estrategiaSeleccionada.constructor.name}`);
        const respuestaFinal = estrategiaSeleccionada.procesar(mensaje);

        this._enviadorRespuestas.enviarRespuestaAlUsuario(mensaje.remitente, respuestaFinal);
    }
}

module.exports = {
    AsistenteVirtual
};