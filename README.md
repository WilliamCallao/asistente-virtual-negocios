# Asistente Virtual Básico en Node.js

Este proyecto es una implementación simple de un sistema de asistente virtual que demuestra el uso de patrones de diseño como Strategy, Factory y Decorator en JavaScript (Node.js).

## Caso de Uso

El sistema simula un asistente virtual que recibe mensajes de texto de los usuarios.
Cuando un usuario envía un mensaje, el sistema:
1.  Intenta detectar la **intención** del usuario (por ejemplo, si quiere información de un producto o realizar una reserva).
2.  Selecciona una **estrategia** de procesamiento adecuada para esa intención.
3.  Utiliza un componente de **Inteligencia Artificial (IA)** (que puede tener funcionalidades adicionales como el registro de interacciones) para generar una respuesta.
4.  Envía la respuesta de vuelta al usuario (simulado a través de la consola).

## Requisitos

*   Node.js instalado en tu sistema.

## Cómo Usar el Sistema

1.  **Clona o descarga este repositorio:**
    ```bash
    git clone https://github.com/WilliamCallao/asistente-virtual-negocios.git
    ```
    ```bash
    cd asistente-virtual-negocios
    ```

2.  **Ejecuta el script principal:**
    Abre una terminal o línea de comandos en la raíz del proyecto y ejecuta:
    ```bash
    node main.js
    ```

3.  **Observa la salida:**
    Verás en la consola cómo el asistente procesa tres mensajes de ejemplo, detecta sus intenciones, selecciona la estrategia correspondiente y genera una respuesta.
