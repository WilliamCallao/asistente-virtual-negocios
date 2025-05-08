class Mensaje {
    constructor(remitente, texto) {
        this.remitente = remitente;
        this.texto = texto;
    }
}

const Intencion = {
    PRODUCTO: "PRODUCTO",
    RESERVA: "RESERVA",
    SALUDO: "SALUDO",
    DESCONOCIDO: "DESCONOCIDO"
};

module.exports = {
    Mensaje,
    Intencion
};
