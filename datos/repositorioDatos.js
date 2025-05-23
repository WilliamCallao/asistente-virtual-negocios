class RepositorioDatos {
    obtenerInformacion(intencion) {
        if (intencion === "PRODUCTO") {
            return "informacion-productos";
        } else if (intencion === "RESERVA") {
            return "informacion-reservas";
        } else {
            return "informacion-general";
        }
    }
}

module.exports = RepositorioDatos;
