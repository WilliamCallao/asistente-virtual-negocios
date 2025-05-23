import os
from datetime import datetime

def obtener_estructura_directorio(ruta='.'):
    """Genera un diccionario con la estructura de directorios y archivos"""
    estructura = {}
    for nombre in os.listdir(ruta):
        ruta_completa = os.path.join(ruta, nombre)
        if os.path.isdir(ruta_completa) and nombre not in ['node_modules', '.git']:
            estructura[nombre] = obtener_estructura_directorio(ruta_completa)
        elif nombre.endswith(('.js', '.py')) and nombre != os.path.basename(__file__):
            estructura[nombre] = None
    return estructura

def generar_contenido_archivo(ruta_archivo):
    """Genera el contenido de un archivo con un encabezado descriptivo"""
    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            contenido = f.read()
        return contenido
    except Exception as e:
        return f"Error al leer el archivo: {e}"

def escribir_estructura(estructura, archivo_salida, ruta_base='.', nivel=0):
    """Escribe recursivamente la estructura de directorios y el contenido de los archivos"""
    for nombre, contenido in estructura.items():
        ruta_completa = os.path.join(ruta_base, nombre)
        ruta_relativa = os.path.relpath(ruta_completa, '.')
        
        # Escribir encabezado del archivo o directorio
        prefijo = '│   ' * (nivel - 1) + '├── ' if nivel > 0 else ''
        ruta_formateada = ruta_relativa.replace('\\', '/')
        archivo_salida.write(f"\n{'#' * 80}\n")
        archivo_salida.write(f"{prefijo}{ruta_formateada}\n")
        archivo_salida.write(f"{'#' * 80}\n\n")
        
        if contenido is None:
            # Es un archivo, escribir su contenido
            contenido_archivo = generar_contenido_archivo(ruta_completa)
            archivo_salida.write(contenido_archivo + "\n")
        else:
            # Es un directorio, procesar recursivamente
            escribir_estructura(contenido, archivo_salida, ruta_completa, nivel + 1)

def main():
    # Configuración
    archivo_salida = "proyecto_exportado.txt"
    
    # Generar cabecera
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        f.write(f"""{'=' * 80}
EXPORTACIÓN DEL PROYECTO
{'=' * 80}
Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Directorio: {os.path.abspath('.')}
{'=' * 80}\n\n""")
        
        # Obtener y escribir la estructura del proyecto
        estructura = obtener_estructura_directorio()
        escribir_estructura(estructura, f)
        
        # Escribir resumen
        f.write(f"\n{'=' * 80}\n")
        f.write("RESUMEN DEL PROYECTO\n")
        f.write(f"{'=' * 80}\n")
        f.write(f"- Total de archivos: {sum(1 for _, _, archivos in os.walk('.') for f in archivos if f.endswith(('.js', '.py')) and f != os.path.basename(__file__))}\n")
        f.write(f"- Directorios principales: {', '.join([d for d in os.listdir('.') if os.path.isdir(d) and d not in ['node_modules', '.git']])}\n")
    
    print(f"\nExportación completada: {os.path.abspath(archivo_salida)}")

if __name__ == "__main__":
    main()
