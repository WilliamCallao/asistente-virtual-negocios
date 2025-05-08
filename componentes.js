class EmisorWhatsapp {
    enviarRespuestaAlUsuario(usuario, texto) {
        console.log("Enviando repuesta -> " + usuario + ":" + texto);
    }
}

class ModeloIA {
    // OpenIA
    generarRespuestaIA(mensaje, contexto) {
        return "Respuesta con IA";
    }
}

class Negocio {
    // BD
    obtenerInformacion(intencion) {
        if (intencion === "PRODUCTO") {
            return "informacionrmacion-productos";
        } else if (intencion === "RESERVA") {
            return "informacionrmacion-reservas";
        } else {
            return "informacionrmacion-general";
        }
    }
}

class DetectorDeIntenciones {
    // IA
    detectar(texto) {
        let intencion = "DESCONOCIDO";
        let texto2 = texto.toLowerCase();
        if (texto2.includes("precio")) {
            intencion = "PRODUCTO";
        } else if (texto2.includes("reserva")) {
            intencion = "RESERVA";
        } else if (texto2.includes("hola")) {
            intencion = "SALUDO";
        }
        console.log("Intención detectada -> " + intencion);
        return intencion;
    }
}

module.exports = {
    EmisorWhatsapp,
    ModeloIA,
    Negocio,
    DetectorDeIntenciones
};