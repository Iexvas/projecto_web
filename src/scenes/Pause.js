import Phaser from 'phaser';

export class Pause extends Phaser.Scene {
    constructor() {
        super({ key: 'Pause' });
    }

    init(data) {
        // Recibimos el soldado elegido para poder pasarlo de vuelta si se reinicia el nivel
        this.soldadoElegido = data.soldadoElegido || 0;
    }

    create() {
        // 1. Fondo semi-transparente para oscurecer el nivel de fondo
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);

        // Título de Pausa
        this.add.text(400, 150, 'PAUSE MENU', {
            fontSize: '40px',
            fontStyle: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // 2. Configurar las opciones del menú
        this.opciones = ['REANUDAR', 'REINICIAR NIVEL', 'SELECCIÓN DE PERSONAJE'];
        this.textosOpciones = [];
        this.seleccionActual = 0;

        for (let i = 0; i < this.opciones.length; i++) {
            let texto = this.add.text(400, 280 + (i * 60), this.opciones[i], {
                fontSize: '24px',
                fontStyle: 'bold',
                fill: '#aaaaaa'
            }).setOrigin(0.5);
            
            this.textosOpciones.push(texto);
        }

        this.actualizarVisualizacion();

        // 3. Controles de teclado
        this.teclas = this.input.keyboard.addKeys({
            arriba: Phaser.Input.Keyboard.KeyCodes.UP,
            abajo: Phaser.Input.Keyboard.KeyCodes.DOWN,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            espacio: Phaser.Input.Keyboard.KeyCodes.SPACE,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });
    }

    update() {
        // Navegar hacia arriba
        if (Phaser.Input.Keyboard.JustDown(this.teclas.arriba) || Phaser.Input.Keyboard.JustDown(this.teclas.w)) {
            if (this.seleccionActual > 0) {
                this.seleccionActual--;
                this.actualizarVisualizacion();
            }
        }

        // Navegar hacia abajo
        if (Phaser.Input.Keyboard.JustDown(this.teclas.abajo) || Phaser.Input.Keyboard.JustDown(this.teclas.s)) {
            if (this.seleccionActual < this.opciones.length - 1) {
                this.seleccionActual++;
                this.actualizarVisualizacion();
            }
        }

        // Confirmar opción
        if (Phaser.Input.Keyboard.JustDown(this.teclas.enter) || Phaser.Input.Keyboard.JustDown(this.teclas.espacio)) {
            this.ejecutarOpcion();
        }

        // Si presionan ESC de nuevo, simplemente reanudamos el juego
        if (Phaser.Input.Keyboard.JustDown(this.teclas.esc)) {
            this.reanudarJuego();
        }
    }

    actualizarVisualizacion() {
        for (let i = 0; i < this.textosOpciones.length; i++) {
            if (i === this.seleccionActual) {
                this.textosOpciones[i].setFill('#ffaa00'); // Resalta la opción activa en amarillo/naranja
                this.textosOpciones[i].setFontSize('28px');
            } else {
                this.textosOpciones[i].setFill('#aaaaaa');
                this.textosOpciones[i].setFontSize('24px');
            }
        }
    }

    ejecutarOpcion() {
        switch (this.seleccionActual) {
            case 0: // REANUDAR
                this.reanudarJuego();
                break;
            case 1: // REINICIAR NIVEL
                this.scene.stop('Level1');
                this.scene.start('Level1', { soldadoElegido: this.soldadoElegido });
                this.scene.stop(); // Detiene esta escena de pausa
                break;
            case 2: // REGRESAR A SELECCIÓN
                this.scene.stop('Level1');
                this.scene.start('MenuScene');
                this.scene.stop();
                break;
        }
    }

    reanudarJuego() {
        this.scene.resume('Level1'); // Quita la pausa a Level1
        this.scene.stop(); // Apaga el menú de pausa
    }
}