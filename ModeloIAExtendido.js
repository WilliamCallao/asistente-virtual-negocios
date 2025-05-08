class ModeloIAExtendido {
    constructor(original) {
        this.original = original;
    }

    generarRespuestaIA(mensaje, contexto) {
        const respuesta = this.original.generarRespuestaIA(mensaje, contexto);
        console.log("Guardando respuesta -> Historial");
        return respuesta;
    }
}

module.exports = {
    ModeloIAExtendido
};