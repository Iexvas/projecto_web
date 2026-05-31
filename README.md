# Proyecto Web - Juego en Phaser

Este es un juego de plataformas 2D desarrollado en JavaScript utilizando el motor web [Phaser 4](https://phaser.io/) y [Vite](https://vitejs.dev/) como herramienta de compilación en el entorno de desarrollo.

## Guía de Ejecución

Para iniciar este proyecto en un entorno local, es necesario contar con [Node.js](https://nodejs.org/) instalado. Siga estos pasos:

1. Clonar o descargar el código fuente del repositorio.
2. Abrir la terminal ubicándose en el directorio principal del proyecto (`projecto_web`).
3. Instalar las dependencias del proyecto ejecutando:
   ```bash
   npm install
   ```
4. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```
5. Acceder a la URL local proporcionada en la terminal, por defecto suele ser `http://localhost:5173/`, a través de un navegador web para ejecutar el programa.

## Controles

El juego permite la interacción mediante el teclado, soportando tanto el bloque de flechas direccionales como la configuración de teclas WASD clásicas.

* Movimiento lateral (Izquierda/Derecha): `A` / `D` o `Flecha Izquierda` / `Flecha Derecha`
* Saltar: `W` o `Flecha Arriba`
* Disparar: `Z` o `J`
* Comprobación de estado final (Acción de Debug): `K`

## Estructura del Proyecto

El código está organizado de manera que separa recursos, lógica de personajes, configuraciones globales y escenas del ciclo de vida del juego:

```text
projecto_web/
├── package.json         # Dependencias y scripts del proyecto (Vite, Phaser)
├── index.html           # Punto de entrada HTML principal
├── public/              # Archivos estáticos de acceso público
└── src/
    ├── main.js          # Configuración inicial del juego, motor de físicas y declaración de escenas
    ├── style.css        # Estilos generales para márgenes y contenedor del lienzo
    ├── assets/          # Todos los recursos multimedia y datos de diseño
    │   ├── audio/       # Pistas de música y efectos de sonido
    │   ├── characters/  # Hojas de sprites de personajes (Abdala, Eloy, Gabriel, Jaime)
    │   ├── enemies/     # Sprites y animaciones de enemigos
    │   ├── levels/      # Estructuras de los niveles en formato de datos
    │   ├── menu/        # Recursos gráficos para menús
    │   ├── objects/     # Sprites de entidades interactivas (municiones, objetos de escenario)
    │   ├── tiles/       # Tilesets del mapa
    │   └── ui/          # Elementos y componentes de interfaces gráficas
    ├── objects/         # Clases que abstraen la lógica y manejo de entidades
    │   ├── Enemy.js     # Lógica e Inteligencia Artificial inicial de los enemigos
    │   └── Player.js    # Físicas, controles, gestión de salud y animaciones del usuario
    └── scenes/          # Escenas de Phaser (Manejo de estados y flujo de ejecución)
        ├── BaseLevel.js # Estratificación de la clase base común para los distintos niveles (Herencia)
        ├── Intro.js     # Secuencia introductoria
        ├── MenuScene.js # Interfaz inicial y menú principal
        ├── LoadingScene.js # Gestor de recursos entre escenarios
        ├── Level1.js    # Escenario Nivel 1
        ├── Level2.js    # Escenario Nivel 2
        ├── Level3.js    # Escenario Nivel 3
        └── Pause.js     # Sistema de interrupción, menú de pausa
```

## Créditos

* **Autores:** Ismael Freire, Jorge Torres, Alexis Vasco
* **Tecnologías empleadas:** Phaser 4.1.0 y Vite 8.0.12.
