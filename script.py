import sys
import json

def main():
  # Leer el JSON de los argumentos de la línea de comandos
  varsText = sys.argv[1]
  varsJson = json.loads(varsText)

  # Abrir el archivo .env.example y leer las variables existentes
  with open('.env.example', 'r') as env_example_file:
    env_data = env_example_file.readlines()

  # Crear un diccionario temporal para almacenar las asignaciones
  temp_env_data = {}

  # Procesar las líneas del .env.example
  for line in env_data:
    if line.strip() and not line.strip().startswith('#'):
      key, _ = line.strip().split('=', 1)

      # Intentar obtener el valor del JSON para la variable actual
      if key in varsJson:
        value = varsJson[key]
        temp_env_data[key] = value
      else:
        raise ValueError(f'Error: Variable {key} no encontrada en el JSON.')

  # Escribir las asignaciones en el archivo .env
  with open('.env', 'w') as env_file:
    for key, value in temp_env_data.items():
      env_file.write(f'{key}="{value}"\n')

if __name__ == "__main__":
  main()

