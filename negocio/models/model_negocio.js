const RepositorioDatos = require('../../datos/repositorioDatos');

class Negocio {
    constructor() {
        this.repositorioDatos = new RepositorioDatos();
    }
    obtenerInformacion(intencion) {
        return this.repositorioDatos.obtenerInformacion(intencion);
    }
}

module.exports = Negocio;

