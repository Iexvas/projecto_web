import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // 1. Cargar las imágenes desde la carpeta public/assets/menu/
        // (Ajusta los nombres de los archivos según los que tú tengas)
        this.load.image('marco_contenedor', '/src/assets/menu/contenedor.jpg');
        this.load.image('soldado0', '/src/assets/menu/gabriel.png');
        this.load.image('soldado1', '/src/assets/menu/abdala.png');
        this.load.image('soldado2', '/src/assets/menu/eloy.png');
        this.load.image('soldado3', '/src/assets/menu/jaime.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(390, 105, 'ELIGE A TÚ REPRESENTANTE', {
            fontSize: '23px',
            fontFamily: 'Papyrus',
            fill: '#C9D1D9',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10);

        this.opciones = [];
        this.seleccionActual = 0;

        const posicionY = 300;

        // Un solo contenedor grande para los 4 personajes
        this.add.image(400, posicionY, 'marco_contenedor')
            .setOrigin(0.5)
            .setDisplaySize(800, 450);

        // Posiciones de los 4 personajes dentro del panel
        const posicionesX = [96, 300, 500, 700];

        for (let i = 0; i < 4; i++) {
            let soldado = this.add.image(posicionesX[i], posicionY,     `soldado${i}`)
                .setOrigin(0.5).setScale(0.178);

            this.opciones.push(soldado);
        }

        this.indicadorP1 = this.add.text(1, posicionY - 140, 'P1 ▼', {
            fontSize: '24px',
            fill: '#ffaa00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.actualizarSeleccion();

        this.teclas = this.input.keyboard.addKeys({
            izq: Phaser.Input.Keyboard.KeyCodes.LEFT,
            der: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            espacio: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    update() {
        // Lógica para mover la selección a la izquierda
        if (Phaser.Input.Keyboard.JustDown(this.teclas.izq) || Phaser.Input.Keyboard.JustDown(this.teclas.a)) {
            if (this.seleccionActual > 0) {
                this.seleccionActual--;
                this.actualizarSeleccion();
            }
        }

        // Lógica para mover la selección a la derecha
        if (Phaser.Input.Keyboard.JustDown(this.teclas.der) || Phaser.Input.Keyboard.JustDown(this.teclas.d)) {
            if (this.seleccionActual < 3) { // 3 porque tenemos 4 soldados (0, 1, 2, 3)
                this.seleccionActual++;
                this.actualizarSeleccion();
            }
        }

        // Lógica para confirmar la selección y empezar el juego
        if (Phaser.Input.Keyboard.JustDown(this.teclas.enter) || Phaser.Input.Keyboard.JustDown(this.teclas.espacio)) {
            this.iniciarJuego();
        }
    }

    actualizarSeleccion() {
        // Recorremos los 4 soldados para cambiarles el color y oscurecer los no seleccionados
        for (let i = 0; i < this.opciones.length; i++) {
            if (i === this.seleccionActual) {
                // Seleccionado: Color normal, opacidad al 100%
                this.opciones[i].setTint(0xffffff);
                this.opciones[i].setAlpha(1);
                
                // Movemos el texto "P1" justo encima de este soldado
                this.indicadorP1.x = this.opciones[i].x;
            } else {
                // No seleccionado: Lo tintamos de un gris oscuro (como en Metal Slug)
                this.opciones[i].setTint(0x555555);
                this.opciones[i].setAlpha(0.7);
            }
        }
    }

    iniciarJuego() {
        // Al presionar Enter, pasamos a Level1 y le enviamos qué soldado elegimos
        // Para que Level1 sepa qué sprite de jugador cargar.
        this.scene.start('Level1', { soldadoElegido: this.seleccionActual });
    }
}