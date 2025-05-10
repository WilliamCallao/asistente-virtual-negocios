// Clase base
class IA {
    generarRespuestaIA(mensaje, contexto) {
        return "Respuesta con IA";
    }
}

// Decorador
class IAConRegistro {
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
    IA,
    IAConRegistro
};
