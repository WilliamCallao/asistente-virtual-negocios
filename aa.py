import sys
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum, auto
from typing import Dict, Optional

# --- 1. CONTRATOS

class IAdaptadorCanal(ABC):
    @abstractmethod
    def enviar_mensaje(self, destinatario: str, contenido: str): pass

class IServicioCognitivo(ABC):
    @abstractmethod
    def obtener_respuesta(self, entrada_usuario: str, contexto_negocio: str) -> str: pass

class IManejadorDeAccion(ABC):
    @abstractmethod
    def procesar(self, mensaje: 'Mensaje') -> str: pass

# --- 2. DATOS Y ENUMS ---

@dataclass
class Mensaje:
    remitente: str
    contenido: str

class Intencion(Enum):
    CONSULTA_PRODUCTO = auto()
    RESERVA = auto()
    SALUDO = auto()
    DESCONOCIDA = auto()

# --- 3. IMPLEMENTACIONES CONCRETAS ---

class AdaptadorWhatsAppSimulado(IAdaptadorCanal):
    def enviar_mensaje(self, destinatario: str, contenido: str):
        print(f"Adaptador: Enviando respuesta a [{destinatario}]")

class ServicioCognitivoSimulado(IServicioCognitivo):
    def obtener_respuesta(self, entrada_usuario: str, contexto_negocio: str) -> str:
        print(f"    [IA] Procesando: '{entrada_usuario}' (Contexto: {contexto_negocio})")
        return f"respuesta_IA({contexto_negocio})" # Respuesta simulada simple

class FuenteDeDatosNegocio:
    def obtener_contexto(self, intencion: Intencion) -> str:
        if intencion == Intencion.CONSULTA_PRODUCTO: return "Contexto_Producto"
        if intencion == Intencion.RESERVA: return "Contexto_Reserva"
        return "Contexto_General"

# SRP: Determina intención (simulado)
class SelectorDeIntencion:
    def determinar_intencion(self, texto_mensaje: str) -> Intencion:
        print(f" - Analizando intencion de: '{texto_mensaje}'")
        texto_lower = texto_mensaje.lower()
        if "producto" in texto_lower or "precio" in texto_lower: return Intencion.CONSULTA_PRODUCTO
        if "reservar" in texto_lower or "cita" in texto_lower: return Intencion.RESERVA
        if "hola" in texto_lower: return Intencion.SALUDO
        return Intencion.DESCONOCIDA

# --- Manejadores Específicos (Implementan IManejadorDeAccion - LSP, SRP, OCP) ---

class ManejadorConsultasProducto(IManejadorDeAccion):
    def __init__(self, servicio_ia: IServicioCognitivo, datos_negocio: FuenteDeDatosNegocio):
        self._servicio_ia = servicio_ia
        self._datos_negocio = datos_negocio
    def procesar(self, mensaje: Mensaje) -> str:
        print(f"  -> Manejador: {self.__class__.__name__}")
        contexto = self._datos_negocio.obtener_contexto(Intencion.CONSULTA_PRODUCTO)
        resp_ia = self._servicio_ia.obtener_respuesta(mensaje.contenido, contexto)
        return f"Resp_Producto({resp_ia})"

class ManejadorReservas(IManejadorDeAccion):
    def __init__(self, servicio_ia: IServicioCognitivo, datos_negocio: FuenteDeDatosNegocio):
        self._servicio_ia = servicio_ia
        self._datos_negocio = datos_negocio
    def procesar(self, mensaje: Mensaje) -> str:
        print(f"  -> Manejador: {self.__class__.__name__}")
        contexto = self._datos_negocio.obtener_contexto(Intencion.RESERVA)
        resp_ia = self._servicio_ia.obtener_respuesta(mensaje.contenido, contexto)
        return f"Resp_Reserva({resp_ia})"

class ManejadorSaludo(IManejadorDeAccion):
    def procesar(self, mensaje: Mensaje) -> str:
        print(f"  -> Manejador: {self.__class__.__name__}")
        return "Resp_Saludo(¡Hola!)"

class ManejadorDesconocido(IManejadorDeAccion):
    def __init__(self, servicio_ia: IServicioCognitivo, datos_negocio: FuenteDeDatosNegocio):
        self._servicio_ia = servicio_ia
        self._datos_negocio = datos_negocio
    def procesar(self, mensaje: Mensaje) -> str:
        contexto = self._datos_negocio.obtener_contexto(Intencion.DESCONOCIDA)
        resp_ia = self._servicio_ia.obtener_respuesta(mensaje.contenido, contexto)
        return f"Resp_Desconocida({resp_ia})"

# --- 4. COORDINADOR PRINCIPAL (Orquesta el flujo - SRP, DIP, OCP) ---

class CoordinadorPrincipal:
    def __init__(self, selector: SelectorDeIntencion, adaptador_canal: IAdaptadorCanal, manejadores: Dict[Intencion, IManejadorDeAccion]):
        self._selector = selector
        self._adaptador_canal = adaptador_canal
        self._manejadores = manejadores

    def procesar_mensaje_entrante(self, mensaje: Mensaje):
        print(f"\nNUEVO MENSAJE: {mensaje.remitente}")
        intencion = self._selector.determinar_intencion(mensaje.contenido)
        print(f" - Intención detectada: {intencion.name}")
        manejador = self._manejadores.get(intencion, self._manejadores.get(Intencion.DESCONOCIDA))
        print(f" - Delegando a: {type(manejador).__name__}")
        respuesta = manejador.procesar(mensaje)
    
        print(f"  [Coordinador] Respuesta final: '{respuesta}'")
        self._adaptador_canal.enviar_mensaje(mensaje.remitente, respuesta)

# --- 5. PUNTO DE ENTRADA (Ensamblaje y Simulación) ---

if __name__ == "__main__":
    print("--- Configurando Bot ---")
    # 1. Crear componentes base
    adaptador = AdaptadorWhatsAppSimulado()
    datos_negocio = FuenteDeDatosNegocio()
    servicio_ia = ServicioCognitivoSimulado()
    selector = SelectorDeIntencion()

    # 2. Crear manejadores (inyectando dependencias)
    manejador_consulta = ManejadorConsultasProducto(servicio_ia, datos_negocio)
    manejador_reserva = ManejadorReservas(servicio_ia, datos_negocio)
    manejador_saludo = ManejadorSaludo()
    manejador_desconocido = ManejadorDesconocido(servicio_ia, datos_negocio)

    # 3. Mapa de manejadores (Clave OCP)
    mapa_manejadores: Dict[Intencion, IManejadorDeAccion] = {
        Intencion.CONSULTA_PRODUCTO: manejador_consulta,
        Intencion.RESERVA: manejador_reserva,
        Intencion.SALUDO: manejador_saludo,
        Intencion.DESCONOCIDA: manejador_desconocido
    }

    # 4. Crear Coordinador (inyectando todo)
    coordinador = CoordinadorPrincipal(selector, adaptador, mapa_manejadores)

    print("\n--- Iniciando Simulación ---")
    # 5. Simular mensajes
    coordinador.procesar_mensaje_entrante(Mensaje("User1", "Hola"))
    coordinador.procesar_mensaje_entrante(Mensaje("User2", "Precio producto X?"))
    coordinador.procesar_mensaje_entrante(Mensaje("User3", "Quiero reservar"))
    coordinador.procesar_mensaje_entrante(Mensaje("User1", "Gracias")) # Desconocida

    print("\n--- Simulación Finalizada ---")