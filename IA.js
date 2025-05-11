// PATRÓN DECORATOR
//
// Este archivo muestra la aplicación del patrón Decorator para añadir
// funcionalidades adicionales a un objeto `IA` de forma dinámica.
// - `IA`: Actúa como el "Componente" base, definiendo la interfaz
//   (`generarRespuestaIA`) que el decorador también implementará.
// - `IAConRegistro`: Es el "Decorador Concreto". Envuelve un objeto `IA` 
//    y añade una nueva responsabilidad (registrar la respuesta) antes o 
//    después de delegar la llamada al objeto envuelto.
// El objetivo es extender la funcionalidad de los objetos `IA` sin modificar
// su clase original y permitiendo que estas extensiones sean opcionales y
// combinables.

class IA {
    generarRespuestaIA(mensaje, contexto) {
        console.log("Generando respuesta -> IA");
        return "Respuesta con IA";
    }
}

class IAConRegistro {
    constructor(original) {
        this.original = original;
    }

    generarRespuestaIA(mensaje, contexto) {
        const respuesta = this.original.generarRespuestaIA(mensaje, contexto);
        console.log("Guardando respuesta -> Historial");
        return respuesta;
    }
}

module.exports = {
    IA,
    IAConRegistro
};
