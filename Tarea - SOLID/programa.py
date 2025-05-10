

import sys
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum, auto
from typing import Dict, Optional

"""
# PRINCIPIO DE SEGREGACIÓN DE INTERFACES
# Las interfaces IAdaptadorRedSocial, IModeloIA e IManejadorDeAccion están definidas
# con métodos específicos y enfocados. Cada interfaz tiene una responsabilidad clara
# y los clientes solo dependen de los métodos que realmente necesitan.
# Esto evita que las clases que implementan estas interfaces dependan de métodos
# que no utilizan.
"""
   
class IAdaptadorRedSocial(ABC):
    @abstractmethod
    def enviar_mensaje(self, destinatario: str, contenido: str): pass

class IModeloIA(ABC):
    @abstractmethod
    def obtener_respuesta(self, entrada_usuario: str, contexto_negocio: str) -> str: pass

class IManejadorDeAccion(ABC):
    @abstractmethod
    def procesar(self, mensaje: 'Mensaje') -> str: pass

@dataclass
class Mensaje:
    remitente: str
    contenido: str

class Intencion(Enum):
    CONSULTA_PRODUCTO = auto()
    RESERVA = auto()
    SALUDO = auto()
    DESCONOCIDA = auto()


class AdaptadorWhatsApp(IAdaptadorRedSocial):
    def enviar_mensaje(self, destinatario: str, contenido: str):
        print(f" - Enviando respuesta a [{destinatario}]")

"""
# PRINCIPIO DE RESPONSABILIDAD ÚNICA
# La clase ServicioOpenIA tiene una única responsabilidad: obtener respuestas
# de un modelo de IA. No se encarga de determinar intenciones, manejar la lógica 
# de negocio o enviar mensajes.
"""

class ServicioOpenIA(IModeloIA):
    def obtener_respuesta(self, entrada_usuario: str, contexto_negocio: str) -> str:
        print(f" - Generando respuesta con: {contexto_negocio}")
        return f"respuesta generada con IA"

class FuenteDeDatosNegocio:
    def obtener_contexto(self, intencion: Intencion) -> str:
        if intencion == Intencion.CONSULTA_PRODUCTO: return "Contexto_Productos"
        if intencion == Intencion.RESERVA: return "Contexto_Reservas"
        return "Contexto_General"
 
class SelectorDeIntencion:
    def determinar_intencion(self, texto_mensaje: str) -> Intencion:
        print(f" - Analizando intencion del mensaje: '{texto_mensaje}'")
        texto_lower = texto_mensaje.lower()
        intencion_detectada = Intencion.DESCONOCIDA
        if "precio" in texto_lower:
            intencion_detectada = Intencion.CONSULTA_PRODUCTO
        elif "reserva" in texto_lower:
            intencion_detectada = Intencion.RESERVA
        elif "hola" in texto_lower:
            intencion_detectada = Intencion.SALUDO
        print(f" - Intención Detectada: {intencion_detectada.name}")
        return intencion_detectada


"""
# PRINCIPIO ABIERTO/CERRADO
# El sistema de manejadores permite añadir nuevos manejadores para nuevas intenciones
# sin modificar el código existente. Simplemente se crea una nueva clase que
# implemente IManejadorDeAccion y se registra en el mapa de manejadores.
"""


class ManejadorConsultasProducto(IManejadorDeAccion):
    def __init__(self, servicio_ia: IModeloIA, datos_negocio: FuenteDeDatosNegocio):
        self._servicio_ia = servicio_ia
        self._datos_negocio = datos_negocio
    def procesar(self, mensaje: Mensaje) -> str:
        contexto = self._datos_negocio.obtener_contexto(Intencion.CONSULTA_PRODUCTO)
        resp_ia = self._servicio_ia.obtener_respuesta(mensaje.contenido, contexto)
        return f"Respuesta_Producto({resp_ia})"

class ManejadorReservas(IManejadorDeAccion):
    def __init__(self, servicio_ia: IModeloIA, datos_negocio: FuenteDeDatosNegocio):
        self._servicio_ia = servicio_ia
        self._datos_negocio = datos_negocio
    def procesar(self, mensaje: Mensaje) -> str:
        contexto = self._datos_negocio.obtener_contexto(Intencion.RESERVA)
        resp_ia = self._servicio_ia.obtener_respuesta(mensaje.contenido, contexto)
        return f"Respuesta_Reserva({resp_ia})"

class ManejadorDesconocido(IManejadorDeAccion):
    def __init__(self, servicio_ia: IModeloIA, datos_negocio: FuenteDeDatosNegocio):
        self._servicio_ia = servicio_ia
        self._datos_negocio = datos_negocio
    def procesar(self, mensaje: Mensaje) -> str:
        contexto = self._datos_negocio.obtener_contexto(Intencion.DESCONOCIDA)
        resp_ia = self._servicio_ia.obtener_respuesta(mensaje.contenido, contexto)
        return f"Respuesta_Desconocida({resp_ia})"
 
"""
# PRINCIPIO DE INVERSIÓN DE DEPENDENCIAS
# La clase CoordinadorPrincipal depende de abstracciones y no de implementaciones concretas
# Recibe un SelectorDeIntencion, un IAdaptadorRedSocial y un diccionario
# de manejadores que implementan IManejadorDeAccion. 
# Esto permite cambiar fácilmente las implementaciones sin modificar el coordinador. Los 
# módulos de alto nivel no dependen de los módulos de bajo nivel
"""


class CoordinadorPrincipal:
    def __init__(self, selector: SelectorDeIntencion, adaptador_canal: IAdaptadorRedSocial, manejadores: Dict[Intencion, IManejadorDeAccion]):
        self._selector = selector
        self._adaptador_canal = adaptador_canal
        self._manejadores = manejadores

    """
    # PRINCIPIO DE SUSTITUCIÓN DE LISKOV (L)
    # En el método procesar_mensaje_entrante, el CoordinadorPrincipal utiliza
    # cualquier implementación de IManejadorDeAccion sin importar su tipo concreto.
    # Los manejadores pueden tener diferentes implementaciones, pero todos pueden ser 
    # utilizados de manera intercambiable a través de su interfaz común.
    """

    def procesar_mensaje_entrante(self, mensaje: Mensaje):
        print(f"\nNuevo mensaje: {mensaje.remitente}")
        intencion = self._selector.determinar_intencion(mensaje.contenido)
        manejador = self._manejadores.get(intencion, self._manejadores.get(Intencion.DESCONOCIDA))
        print(f" - Delegando a: {type(manejador).__name__}")
        respuesta = manejador.procesar(mensaje)    
        self._adaptador_canal.enviar_mensaje(mensaje.remitente, respuesta)


# —-------------------------

if __name__ == "__main__":
    adaptador = AdaptadorWhatsApp()
    datos_negocio = FuenteDeDatosNegocio()
    servicio_ia = ServicioOpenIA()
    selector = SelectorDeIntencion()

    manejador_consulta = ManejadorConsultasProducto(servicio_ia, datos_negocio)
    manejador_reserva = ManejadorReservas(servicio_ia, datos_negocio)
    manejador_desconocido = ManejadorDesconocido(servicio_ia, datos_negocio)

    mapa_manejadores: Dict[Intencion, IManejadorDeAccion] = {
        Intencion.CONSULTA_PRODUCTO: manejador_consulta,
        Intencion.RESERVA: manejador_reserva,
        Intencion.DESCONOCIDA: manejador_desconocido
    }

    coordinador = CoordinadorPrincipal(selector, adaptador, mapa_manejadores)

    coordinador.procesar_mensaje_entrante(Mensaje("User1", "Hola"))
    coordinador.procesar_mensaje_entrante(Mensaje("User2", "Precio del producto A ?"))
    coordinador.procesar_mensaje_entrante(Mensaje("User3", "Quiero una reserva"))




