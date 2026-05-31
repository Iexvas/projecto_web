# Proyecto Web - Juego en Phaser

Este proyecto es un juego de plataformas 2D desarrollado en JavaScript con [Phaser 4](https://phaser.io/) y [Vite](https://vitejs.dev/). El flujo actual incluye pantalla de inicio, menú principal, captura del nombre del jugador, selección del personaje, niveles jugables, pausa y pantalla de puntajes.

## Guía de Ejecución

Para ejecutar el proyecto en un entorno local, es necesario tener instalado [Node.js](https://nodejs.org/). Después, siga estos pasos:

1. Abra una terminal en la carpeta raíz del proyecto `projecto_web`.
2. Instale las dependencias:
   ```bash
   npm install
   ```
3. Inicie el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abra en el navegador la dirección local que indique Vite, normalmente `http://localhost:5173/`.

Para generar una versión optimizada para producción:

```bash
npm run build
```

Para previsualizar la compilación generada:

```bash
npm run preview
```

## Controles

El juego utiliza teclado para navegar por los menús y para controlar al personaje durante la partida.

### Menú principal

* Mover selección: `Flecha Arriba` / `Flecha Abajo`
* Confirmar opción: `Enter`

### Captura de nombre

* Escribir nombre: letras, números, espacio y los caracteres `-` y `_`
* Borrar carácter: `Backspace`
* Confirmar nombre: `Enter`

### Selección de personaje

* Mover selección: `Flecha Izquierda` / `Flecha Derecha` o `A` / `D`
* Confirmar selección: `Enter` o `Espacio`

### Jugabilidad

* Moverse: `A` / `D` o `Flecha Izquierda` / `Flecha Derecha`
* Saltar: `W` o `Flecha Arriba`
* Disparar: `Z` o `J`
* Prueba de muerte: `K`
* Pausa: desde la lógica del nivel se activa mediante el sistema de pausa incluido en cada escena

## Estructura del Proyecto

El código está organizado para separar el punto de entrada, los recursos, la lógica de entidades y las escenas del juego:

```text
projecto_web/
├── package.json
├── index.html
├── public/
└── src/
    ├── main.js
    ├── style.css
    ├── assets/
    │   ├── audio/
    │   ├── characters/
    │   │   ├── abdala/
    │   │   ├── eloy/
    │   │   ├── gabriel/
    │   │   └── jaime/
    │   ├── enemies/
    │   ├── levels/
    │   ├── menu/
    │   ├── objects/
    │   ├── tiles/
    │   └── ui/
    ├── objects/
    │   ├── Enemy.js
    │   └── Player.js
    └── scenes/
        ├── BaseLevel.js
        ├── GameOverScene.js
        ├── Intro.js
        ├── Level1.js
        ├── Level2.js
        ├── Level3.js
        ├── LoadingScene.js
        ├── MainMenuScene.js
        ├── MenuScene.js
        ├── Pause.js
        ├── PlayerNameScene.js
        └── ScoresScene.js
```

## Créditos

* **Autores del proyecto:** Ismael Freire, Jorge Torres, Alexis Vasco
* **Motor de juego:** Phaser 4.1.0
* **Herramienta de desarrollo y compilación:** Vite 8.0.12
