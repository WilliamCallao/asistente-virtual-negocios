// decoradores.js

class LoggingMotorIADecorator {
    constructor(motorIAEnvuelto) {
        this._motorIAEnvuelto = motorIAEnvuelto;
        console.log("DECORADOR: LoggingMotorIADecorator inicializado.");
    }

    generarRespuestaIA(mensajeUsuario, pistaContexto) {
        console.log(`  DECORADOR_LOG: [IA Request] Mensaje: "${mensajeUsuario}", Contexto: "${pistaContexto}"`);
        const respuesta = this._motorIAEnvuelto.generarRespuestaIA(mensajeUsuario, pistaContexto);
        console.log(`  DECORADOR_LOG: [IA Response] Respuesta: "${respuesta}"`);
        return respuesta;
    }
}

module.exports = {
    LoggingMotorIADecorator
};