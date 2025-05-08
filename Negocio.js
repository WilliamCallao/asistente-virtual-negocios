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

module.exports = Negocio;
