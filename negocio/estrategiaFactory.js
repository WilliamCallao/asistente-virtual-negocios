// PATRÓN SIMPLE FACTORY
//
// Este archivo implementa una "Fábrica Simple" para crear objetos de estrategia.
// La función `crearEstrategia` encapsula la lógica de decisión sobre qué
// estrategia concreta (`EstrategiaConsultaProducto`, `EstrategiaReserva`, etc.)
// instanciar, basándose en el parámetro `intencion`.
//
// El objetivo es desacoplar al cliente (el código que necesita una estrategia)
// de la creación específica de estas estrategias. El cliente solo pide una
// estrategia por tipo, y la fábrica se encarga de los detalles de instanciación.
// Esto centraliza la creación de objetos y facilita cambios futuros.

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
