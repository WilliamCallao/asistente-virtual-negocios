class MensajeRecibido {
    constructor(quienEnvia, queDice) {
        this.quienEnvia = quienEnvia;
        this.queDice = queDice;
    }
}

const TipoDeIntencion = Object.freeze({
    PREGUNTAR_POR_PRODUCTO: "PREGUNTAR_POR_PRODUCTO",
    HACER_RESERVA: "HACER_RESERVA",
    SALUDAR: "SALUDAR",
    NO_SE_ENTIENDE: "NO_SE_ENTIENDE"
});

class EnviadorDeRespuestas {
    enviarRespuestaAUsuario(usuario, textoRespuesta) {
        throw new Error("Método 'enviarRespuestaAUsuario' debe ser implementado por la subclase.");
    }
}

class CerebroIA {
    generarTextoRespuesta(mensajeUsuario, pistaContexto) {
        throw new Error("Método 'generarTextoRespuesta' debe ser implementado por la subclase.");
    }
}

class ProcesadorDeMensajes {
    procesarYResponder(mensaje) {
        throw new Error("Método 'procesarYResponder' debe ser implementado por la subclase.");
    }
}

class EnviadorPorConsola extends EnviadorDeRespuestas {
    enviarRespuestaAUsuario(usuario, textoRespuesta) {
        console.log(` - (Consola) Enviando a [${usuario}]: ${textoRespuesta}`);
    }
}

class MiMotorDeIA extends CerebroIA {
    generarTextoRespuesta(mensajeUsuario, pistaContexto) {
        console.log(` - (IA) Pensando respuesta para '${mensajeUsuario}' con contexto '${pistaContexto}'...`);
        return `Respuesta de IA basada en '${pistaContexto}'`;
    }
}

class InformacionDelNegocio {
    obtenerPistaParaIA(intencion) {
        if (intencion === TipoDeIntencion.PREGUNTAR_POR_PRODUCTO) {
            return "info_productos_para_IA";
        }
        if (intencion === TipoDeIntencion.HACER_RESERVA) {
            return "info_reservas_para_IA";
        }
        return "info_general_para_IA";
    }
}

class DetectorDeIntenciones {
    adivinarIntencion(textoDelMensaje) {
        console.log(` - Analizando intencion del mensaje: '${textoDelMensaje}'`);
        const textoEnMinusculas = textoDelMensaje.toLowerCase();
        let intencionDetectada = TipoDeIntencion.NO_SE_ENTIENDE;

        if (textoEnMinusculas.includes("precio") || textoEnMinusculas.includes("producto")) {
            intencionDetectada = TipoDeIntencion.PREGUNTAR_POR_PRODUCTO;
        } else if (textoEnMinusculas.includes("reserva") || textoEnMinusculas.includes("reservar")) {
            intencionDetectada = TipoDeIntencion.HACER_RESERVA;
        } else if (textoEnMinusculas.includes("hola") || textoEnMinusculas.includes("buenos dias")) {
            intencionDetectada = TipoDeIntencion.SALUDAR;
        }

        console.log(` - Intención Detectada: ${intencionDetectada}`);
        return intencionDetectada;
    }
}

class ProcesadorConsultasProducto extends ProcesadorDeMensajes {
    constructor(cerebroIA, infoNegocio) {
        super();
        this._cerebroIA = cerebroIA;
        this._infoNegocio = infoNegocio;
    }

    procesarYResponder(mensaje) {
        const pista = this._infoNegocio.obtenerPistaParaIA(TipoDeIntencion.PREGUNTAR_POR_PRODUCTO);
        const respuestaIA = this._cerebroIA.generarTextoRespuesta(mensaje.queDice, pista);
        return `Respuesta sobre productos: (${respuestaIA})`;
    }
}

class ProcesadorReservas extends ProcesadorDeMensajes {
    constructor(cerebroIA, infoNegocio) {
        super();
        this._cerebroIA = cerebroIA;
        this._infoNegocio = infoNegocio;
    }

    procesarYResponder(mensaje) {
        const pista = this._infoNegocio.obtenerPistaParaIA(TipoDeIntencion.HACER_RESERVA);
        const respuestaIA = this._cerebroIA.generarTextoRespuesta(mensaje.queDice, pista);
        return `Respuesta sobre reservas: (${respuestaIA})`;
    }
}

class ProcesadorPorDefecto extends ProcesadorDeMensajes {
    constructor(cerebroIA, infoNegocio) {
        super();
        this._cerebroIA = cerebroIA;
        this._infoNegocio = infoNegocio;
    }

    procesarYResponder(mensaje) {
        const pista = this._infoNegocio.obtenerPistaParaIA(TipoDeIntencion.NO_SE_ENTIENDE);
        const respuestaIA = this._cerebroIA.generarTextoRespuesta(mensaje.queDice, pista);
        return `Respuesta general: (${respuestaIA})`;
    }
}

class AsistenteVirtual {
    constructor(detectorInt, enviadorResp, procConsulta, procReserva, procDefecto) {
        this._detectorIntenciones = detectorInt;
        this._enviadorRespuestas = enviadorResp;
        this._procesadorConsultas = procConsulta;
        this._procesadorReservas = procReserva;
        this._procesadorPorDefecto = procDefecto;
    }

    atenderNuevoMensaje(mensaje) {
        console.log(`\nLlegó un nuevo mensaje de: ${mensaje.quienEnvia}`);

        const intencion = this._detectorIntenciones.adivinarIntencion(mensaje.queDice);

        let procesadorElegido;

        if (intencion === TipoDeIntencion.PREGUNTAR_POR_PRODUCTO) {
            console.log(` - Eligiendo ProcesadorConsultasProducto`);
            procesadorElegido = this._procesadorConsultas;
        } else if (intencion === TipoDeIntencion.HACER_RESERVA) {
            console.log(` - Eligiendo ProcesadorReservas`);
            procesadorElegido = this._procesadorReservas;
        } else if (intencion === TipoDeIntencion.SALUDAR) {
            console.log(` - Eligiendo ProcesadorPorDefecto (para saludo)`);
            procesadorElegido = this._procesadorPorDefecto;
        } else {
            console.log(` - Eligiendo ProcesadorPorDefecto (intención no reconocida)`);
            procesadorElegido = this._procesadorPorDefecto;
        }

        const respuestaFinal = procesadorElegido.procesarYResponder(mensaje);

        this._enviadorRespuestas.enviarRespuestaAUsuario(mensaje.quienEnvia, respuestaFinal);
    }
}

const miEnviadorConsola = new EnviadorPorConsola();
const miInfoNegocio = new InformacionDelNegocio();
const miCerebroIA = new MiMotorDeIA();
const miDetectorIntenciones = new DetectorDeIntenciones();

const procesadorDeConsultas = new ProcesadorConsultasProducto(miCerebroIA, miInfoNegocio);
const procesadorDeReservas = new ProcesadorReservas(miCerebroIA, miInfoNegocio);
const procesadorParaTodoLoDemas = new ProcesadorPorDefecto(miCerebroIA, miInfoNegocio);

const asistente = new AsistenteVirtual(
    miDetectorIntenciones,
    miEnviadorConsola,
    procesadorDeConsultas,
    procesadorDeReservas,
    procesadorParaTodoLoDemas
);

asistente.atenderNuevoMensaje(new MensajeRecibido("UsuarioAlfa", "Hola, ¿qué tal?"));
asistente.atenderNuevoMensaje(new MensajeRecibido("UsuarioBeta", "Quiero saber el precio del producto X"));
asistente.atenderNuevoMensaje(new MensajeRecibido("UsuarioGamma", "Necesito hacer una reserva para mañana"));
asistente.atenderNuevoMensaje(new MensajeRecibido("UsuarioDelta", "¿Venden bicicletas?"));
asistente.atenderNuevoMensaje(new MensajeRecibido("UsuarioEpsilon", "blablabla"));