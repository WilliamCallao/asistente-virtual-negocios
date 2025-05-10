const {
    EstrategiaConsultaProducto,
    EstrategiaReserva,
    EstrategiaPorDefecto
} = require('./estrategiaTipos');

function crearEstrategia(intencion, IA, negocio) {

    if (intencion === "PRODUCTO") {
        return new EstrategiaConsultaProducto(IA, negocio);
    }

    if (intencion === "RESERVA") {
        return new EstrategiaReserva(IA, negocio);
    }
    
        return new EstrategiaPorDefecto(IA, negocio);
}

module.exports = crearEstrategia;
