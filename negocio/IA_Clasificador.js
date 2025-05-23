class DetectorDeIntenciones {
    // IA
    detectar(texto) {
        let intencion = "DESCONOCIDO";
        let texto2 = texto.toLowerCase();

        if (texto2.includes("precio")) {
            intencion = "PRODUCTO";
        } else if (texto2.includes("reserva")) {
            intencion = "RESERVA";
        } 
        console.log("Intención detectada -> " + intencion);
        return intencion;
    }
}

module.exports = DetectorDeIntenciones;
