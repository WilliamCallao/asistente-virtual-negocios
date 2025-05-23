class AsistenteVirtual {
    constructor(detectorIntenciones, canalRespuesta, mapaDeEstrategias) {
        this.detectorIntenciones = detectorIntenciones;
        this.canalRespuesta = canalRespuesta;
        this.mapaDeEstrategias = mapaDeEstrategias;
    }

    atenderNuevoMensaje(mensaje) {
        console.log("\n" + mensaje.remitente + " - " + mensaje.texto);
        const intencion = this.detectorIntenciones.detectar(mensaje.texto);
        let estrategiaSeleccionada = this.mapaDeEstrategias[intencion];
        const respuesta = estrategiaSeleccionada.procesar(mensaje);
        this.canalRespuesta.enviarRespuestaAlUsuario(mensaje.remitente, respuesta);
    }
}

module.exports = {
    AsistenteVirtual
};