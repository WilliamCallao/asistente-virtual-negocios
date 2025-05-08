from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum, auto

# --- Clases de Datos Simples ---

@dataclass
class MensajeRecibido:
    """Representa un mensaje simple que llega al sistema."""
    quien_envia: str
    que_dice: str

class TipoDeIntencion(Enum):
    """Define los tipos de cosas que el usuario podría querer."""
    PREGUNTAR_POR_PRODUCTO = auto()
    HACER_RESERVA = auto()
    SALUDAR = auto()
    NO_SE_ENTIENDE = auto()

# --- Interfaces (Contratos Básicos) ---
# Aún útiles para definir qué "hace" cada parte, pero con nombres más simples.

class EnviadorDeRespuestas(ABC):
    """Define cómo se envía una respuesta de vuelta."""
    @abstractmethod
    def enviar_respuesta_a_usuario(self, usuario: str, texto_respuesta: str):
        pass

class CerebroIA(ABC):
    """Define cómo se genera una respuesta usando IA (simulada)."""
    @abstractmethod
    def generar_texto_respuesta(self, mensaje_usuario: str, pista_contexto: str) -> str:
        pass

class ProcesadorDeMensajes(ABC):
    """Define cómo se procesa un mensaje según su intención."""
    @abstractmethod
    def procesar_y_responder(self, mensaje: MensajeRecibido) -> str:
        pass

# --- Implementaciones Concretas (Las partes que "hacen" el trabajo) ---

class EnviadorPorWhatsApp(EnviadorDeRespuestas):
    """Simula enviar un mensaje por WhatsApp."""
    def enviar_respuesta_a_usuario(self, usuario: str, texto_respuesta: str):
        print(f" - (WhatsApp) Enviando a [{usuario}]: {texto_respuesta}")

class MiMotorDeIA(CerebroIA):
    """Simula un motor de IA que genera respuestas."""
    def generar_texto_respuesta(self, mensaje_usuario: str, pista_contexto: str) -> str:
        # En una app real, aquí se llamaría a OpenAI, Gemini, etc.
        print(f" - (IA) Pensando respuesta para '{mensaje_usuario}' con contexto '{pista_contexto}'...")
        return f"Respuesta de IA basada en '{pista_contexto}'"

class InformacionDelNegocio:
    """Simula una fuente de datos con información para la IA."""
    def obtener_pista_para_ia(self, intencion: TipoDeIntencion) -> str:
        if intencion == TipoDeIntencion.PREGUNTAR_POR_PRODUCTO:
            return "info_productos_para_IA"
        if intencion == TipoDeIntencion.HACER_RESERVA:
            return "info_reservas_para_IA"
        return "info_general_para_IA"

class DetectorDeIntenciones:
    """Analiza el texto del mensaje para adivinar qué quiere el usuario."""
    def adivinar_intencion(self, texto_del_mensaje: str) -> TipoDeIntencion:
        print(f" - Analizando intencion del mensaje: '{texto_del_mensaje}'")
        texto_en_minusculas = texto_del_mensaje.lower()
        intencion_detectada = TipoDeIntencion.NO_SE_ENTIENDE

        if "precio" in texto_en_minusculas or "producto" in texto_en_minusculas:
            intencion_detectada = TipoDeIntencion.PREGUNTAR_POR_PRODUCTO
        elif "reserva" in texto_en_minusculas or "reservar" in texto_en_minusculas:
            intencion_detectada = TipoDeIntencion.HACER_RESERVA
        elif "hola" in texto_en_minusculas or "buenos dias" in texto_en_minusculas:
            intencion_detectada = TipoDeIntencion.SALUDAR

        print(f" - Intención Detectada: {intencion_detectada.name}")
        return intencion_detectada

# --- Procesadores Específicos para cada Intención ---
# Cada uno sabe qué hacer para un tipo de mensaje.

class ProcesadorConsultasProducto(ProcesadorDeMensajes):
    def __init__(self, cerebro_ia: CerebroIA, info_negocio: InformacionDelNegocio):
        self._cerebro_ia = cerebro_ia
        self._info_negocio = info_negocio

    def procesar_y_responder(self, mensaje: MensajeRecibido) -> str:
        pista = self._info_negocio.obtener_pista_para_ia(TipoDeIntencion.PREGUNTAR_POR_PRODUCTO)
        respuesta_ia = self._cerebro_ia.generar_texto_respuesta(mensaje.que_dice, pista)
        return f"Respuesta sobre productos: ({respuesta_ia})"

class ProcesadorReservas(ProcesadorDeMensajes):
    def __init__(self, cerebro_ia: CerebroIA, info_negocio: InformacionDelNegocio):
        self._cerebro_ia = cerebro_ia
        self._info_negocio = info_negocio

    def procesar_y_responder(self, mensaje: MensajeRecibido) -> str:
        pista = self._info_negocio.obtener_pista_para_ia(TipoDeIntencion.HACER_RESERVA)
        respuesta_ia = self._cerebro_ia.generar_texto_respuesta(mensaje.que_dice, pista)
        return f"Respuesta sobre reservas: ({respuesta_ia})"

class ProcesadorPorDefecto(ProcesadorDeMensajes):
    """Se usa cuando no se entiende la intención o es un saludo simple."""
    def __init__(self, cerebro_ia: CerebroIA, info_negocio: InformacionDelNegocio):
        self._cerebro_ia = cerebro_ia
        self._info_negocio = info_negocio

    def procesar_y_responder(self, mensaje: MensajeRecibido) -> str:
        # Para saludos, podría tener una respuesta fija o también usar IA.
        # Aquí, para simplificar, usaremos la IA con contexto general.
        if DetectorDeIntenciones().adivinar_intencion(mensaje.que_dice) == TipoDeIntencion.SALUDAR:
             pista = self._info_negocio.obtener_pista_para_ia(TipoDeIntencion.SALUDAR) # O una respuesta fija
             # return "¡Hola! ¿Cómo puedo ayudarte?"
        else:
            pista = self._info_negocio.obtener_pista_para_ia(TipoDeIntencion.NO_SE_ENTIENDE)
        
        respuesta_ia = self._cerebro_ia.generar_texto_respuesta(mensaje.que_dice, pista)
        return f"Respuesta general: ({respuesta_ia})"


# --- El Orquestador Principal (El Asistente en sí) ---

class AsistenteVirtual:
    def __init__(self, detector_int: DetectorDeIntenciones, enviador_resp: EnviadorDeRespuestas,
                 proc_consulta: ProcesadorConsultasProducto, proc_reserva: ProcesadorReservas, proc_defecto: ProcesadorPorDefecto):
        self._detector_intenciones = detector_int
        self._enviador_respuestas = enviador_resp
        # En lugar de un diccionario, "hardcodeamos" los procesadores conocidos
        self._procesador_consultas = proc_consulta
        self._procesador_reservas = proc_reserva
        self._procesador_por_defecto = proc_defecto # Para saludos y desconocidos

    def atender_nuevo_mensaje(self, mensaje: MensajeRecibido):
        print(f"\nLlegó un nuevo mensaje de: {mensaje.quien_envia}")
        
        intencion = self._detector_intenciones.adivinar_intencion(mensaje.que_dice)
        
        procesador_elegido: ProcesadorDeMensajes
        
        # Flujo más directo para seleccionar el procesador
        if intencion == TipoDeIntencion.PREGUNTAR_POR_PRODUCTO:
            print(f" - Eligiendo ProcesadorConsultasProducto")
            procesador_elegido = self._procesador_consultas
        elif intencion == TipoDeIntencion.HACER_RESERVA:
            print(f" - Eligiendo ProcesadorReservas")
            procesador_elegido = self._procesador_reservas
        elif intencion == TipoDeIntencion.SALUDAR:
            print(f" - Eligiendo ProcesadorPorDefecto (para saludo)")
            procesador_elegido = self._procesador_por_defecto
        else: # NO_SE_ENTIENDE
            print(f" - Eligiendo ProcesadorPorDefecto (intención no reconocida)")
            procesador_elegido = self._procesador_por_defecto
            
        respuesta_final = procesador_elegido.procesar_y_responder(mensaje)
        
        self._enviador_respuestas.enviar_respuesta_a_usuario(mensaje.quien_envia, respuesta_final)


# --- Configuración y Ejecución (Parte Principal del Script) ---

if __name__ == "__main__":
    # 1. Crear las "herramientas" que necesita el asistente
    mi_enviador_whatsapp = EnviadorPorWhatsApp()
    mi_info_negocio = InformacionDelNegocio()
    mi_cerebro_ia = MiMotorDeIA()
    mi_detector_intenciones = DetectorDeIntenciones()

    # 2. Crear los "especialistas" (procesadores)
    procesador_de_consultas = ProcesadorConsultasProducto(mi_cerebro_ia, mi_info_negocio)
    procesador_de_reservas = ProcesadorReservas(mi_cerebro_ia, mi_info_negocio)
    procesador_para_todo_lo_demas = ProcesadorPorDefecto(mi_cerebro_ia, mi_info_negocio)

    # 3. Crear el asistente y darle sus herramientas y especialistas
    asistente = AsistenteVirtual(
        detector_int=mi_detector_intenciones,
        enviador_resp=mi_enviador_whatsapp,
        proc_consulta=procesador_de_consultas,
        proc_reserva=procesador_de_reservas,
        proc_defecto=procesador_para_todo_lo_demas
    )

    # 4. Simular la llegada de mensajes
    asistente.atender_nuevo_mensaje(MensajeRecibido("UsuarioAlfa", "Hola, ¿qué tal?"))
    asistente.atender_nuevo_mensaje(MensajeRecibido("UsuarioBeta", "Quiero saber el precio del producto X"))
    asistente.atender_nuevo_mensaje(MensajeRecibido("UsuarioGamma", "Necesito hacer una reserva para mañana"))
    asistente.atender_nuevo_mensaje(MensajeRecibido("UsuarioDelta", "¿Venden bicicletas?")) # Caerá en producto
    asistente.atender_nuevo_mensaje(MensajeRecibido("UsuarioEpsilon", "blablabla")) # Caerá en no entendido